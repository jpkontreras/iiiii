import os
import time
import psycopg2
from paddleocr import PaddleOCR
import json
from datetime import datetime

class DatabaseConnection:
    def __init__(self):
        # These environment variables come from docker-compose which gets them from Laravel's .env
        self.conn = psycopg2.connect(
            dbname=os.environ['DB_DATABASE'],
            user=os.environ['DB_USERNAME'],
            password=os.environ['DB_PASSWORD'],
            host='pgsql',  # This is fixed since it's the service name in docker-compose
            port=os.environ.get('DB_PORT', 5432)  # Optional port from environment
        )

    def __enter__(self):
        return self.conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.close()

class OCRProcessor:
    def __init__(self):
        self.ocr = PaddleOCR(use_angle_cls=True, lang='en', use_gpu=False)
        self.shared_folder = '/app/shared'
        print(f"OCR Processor initialized. Connected to database: {os.environ['DB_DATABASE']}")

    def get_next_task(self, conn):
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE ocr_tasks
                SET 
                    status = 'processing',
                    processing_started_at = NOW()
                WHERE id = (
                    SELECT id 
                    FROM ocr_tasks 
                    WHERE status = 'pending'
                    OR (
                        status = 'processing' 
                        AND processing_started_at < NOW() - INTERVAL '5 minutes'
                    )
                    ORDER BY id
                    FOR UPDATE SKIP LOCKED
                    LIMIT 1
                )
                RETURNING id, file_path;
            """)
            conn.commit()
            return cur.fetchone()

    def process_image(self, image_path):
        try:
            full_path = os.path.join(self.shared_folder, image_path)
            result = self.ocr.ocr(full_path, cls=True)
            
            formatted_result = []
            for line in result:
                for word_info in line:
                    coordinates, (text, confidence) = word_info
                    formatted_result.append({
                        'text': text,
                        'confidence': float(confidence),
                        'coordinates': coordinates
                    })
            
            return formatted_result
        except Exception as e:
            raise Exception(f"Error processing image: {str(e)}")

    def update_task_result(self, conn, task_id, result):
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE ocr_tasks 
                SET 
                    status = 'completed',
                    result = %s
                WHERE id = %s
            """, (json.dumps(result), task_id))
            conn.commit()

    def mark_task_failed(self, conn, task_id, error):
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE ocr_tasks 
                SET 
                    status = 'failed',
                    error = %s
                WHERE id = %s
            """, (str(error), task_id))
            conn.commit()

    def process_queue(self):
        print("Starting OCR queue processing...")
        while True:
            try:
                with DatabaseConnection() as conn:
                    task = self.get_next_task(conn)
                    
                    if task:
                        task_id, file_path = task
                        print(f"Processing task {task_id} for file {file_path}")
                        try:
                            result = self.process_image(file_path)
                            self.update_task_result(conn, task_id, result)
                            print(f"Successfully processed task {task_id}")
                            
                        except Exception as e:
                            self.mark_task_failed(conn, task_id, str(e))
                            print(f"Failed to process task {task_id}: {str(e)}")
                    
                    time.sleep(1)
                    
            except Exception as e:
                print(f"Error in main loop: {str(e)}")
                time.sleep(5)

if __name__ == "__main__":
    processor = OCRProcessor()
    processor.process_queue()
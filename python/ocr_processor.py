import os
import time
import psycopg2
from paddleocr import PaddleOCR
import json
from datetime import datetime
import cv2
import numpy as np
import math

class DatabaseConnection:
    def __init__(self):
        self.conn = psycopg2.connect(
            dbname=os.environ['DB_DATABASE'],
            user=os.environ['DB_USERNAME'],
            password=os.environ['DB_PASSWORD'],
            host='pgsql',
            port=os.environ.get('DB_PORT', 5432)
        )

    def __enter__(self):
        return self.conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.close()

class OCRProcessor:
    def __init__(self):
        self.ocr = PaddleOCR(use_angle_cls=True, lang='en', use_gpu=False)
        self.shared_folder = '/app/shared'
        # Parameters for long image processing
        self.height_segment = 1024  # Height of each segment
        self.overlap = 200          # Overlap between segments
        print(f"OCR Processor initialized. Connected to database: {os.environ['DB_DATABASE']}")

    def process_long_image(self, image_path):
        """
        Process a long image by splitting it into overlapping segments.
        """
        # Read the image
        img = cv2.imread(image_path)
        if img is None:
            raise Exception(f"Failed to read image at {image_path}")
            
        img_height, img_width = img.shape[:2]
        
        # Calculate number of segments needed
        num_segments = math.ceil((img_height - self.overlap) / (self.height_segment - self.overlap))
        
        all_results = []
        
        for i in range(num_segments):
            # Calculate segment boundaries
            start_y = i * (self.height_segment - self.overlap)
            end_y = min(start_y + self.height_segment, img_height)
            
            if i == num_segments - 1:
                # Make sure the last segment reaches the bottom
                start_y = max(0, end_y - self.height_segment)
            
            # Extract segment
            segment = img[start_y:end_y, 0:img_width]
            
            # Process segment
            results = self.ocr.ocr(segment, cls=True)
            
            # Adjust coordinates to match original image position
            if results and results[0]:
                for line in results[0]:
                    box = line[0]
                    text = line[1][0]
                    
                    # Adjust y-coordinates
                    adjusted_box = [[point[0], point[1] + start_y] for point in box]
                    all_results.append({
                        'text': text,
                        'coordinates': adjusted_box
                    })
        
        # Sort results by vertical position (top to bottom)
        all_results.sort(key=lambda x: x['coordinates'][0][1])
        
        return all_results

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
            
            # Read image to get dimensions
            img = cv2.imread(full_path)
            if img is None:
                raise Exception(f"Failed to read image at {full_path}")
                
            height, width = img.shape[:2]
            
            # If image is very tall, use segmented processing
            if height > 2 * self.height_segment:
                result = self.process_long_image(full_path)
            else:
                # Use regular processing for smaller images
                result = self.ocr.ocr(full_path, cls=True)
                formatted_result = []
                for line in result:
                    for word_info in line:
                        coordinates, (text) = word_info
                        formatted_result.append({
                            'text': text,
                            'coordinates': coordinates
                        })
                result = formatted_result
            
            return result
            
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
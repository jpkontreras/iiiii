FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Set environment variable to disable GPU
ENV CUDA_VISIBLE_DEVICES=""

WORKDIR /app

# Install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir \
    paddlepaddle \
    "paddleocr>=2.6.0" \
    Pillow \
    opencv-python-headless \
    psycopg2-binary

# Copy application
COPY . .

CMD ["python", "ocr_processor.py"]
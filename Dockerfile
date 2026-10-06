FROM python:3.11-slim

WORKDIR /app
COPY . .

RUN pip install --no-cache-dir -r backend/requirements.txt

WORKDIR /app/backend

# Hugging Face Spaces expects port 7860; Render uses the $PORT env variable.
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-7860}

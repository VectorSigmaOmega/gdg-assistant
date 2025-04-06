# Use a lightweight Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose port 8080 for Cloud Run
ENV PORT=8080

# Run the Flask app using gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8080", "app:app"]

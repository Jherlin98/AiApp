# Use an official Python image as a base
FROM python:3.8-slim

# Install required dependencies
RUN apt-get update && apt-get install -y curl

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . /app/

# Expose ports
EXPOSE 5000
EXPOSE 11434

# Start Ollama, pull the model, and then start the Flask app
CMD ollama serve & sleep 5 && ollama pull deepseek-r1:1.5b && python app.py

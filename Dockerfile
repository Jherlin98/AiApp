# Use an official Python image as a base image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt to the container
COPY requirements.txt /app/

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install Ollama (add this step to install Ollama)
RUN curl -sSL https://ollama.com/download/ollama-linux-64.tar.gz -o ollama.tar.gz \
    && tar -xvf ollama.tar.gz \
    && chmod +x ./ollama \
    && mv ollama /usr/local/bin/

# Copy the current directory contents into the container
COPY . /app/

# Expose the port where your app will run
EXPOSE 8080
EXPOSE 11434 
# Start Ollama and Flask app together (using a background process for Ollama)
CMD ./ollama server --port 11434 & python app.py

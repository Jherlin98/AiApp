# Use an official Python image as a base image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt to the container
COPY requirements.txt /app/

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container
COPY . /app/

# Expose the port where your app will run
EXPOSE 8080

# Run the model inference code (modify as per your application)
CMD ["python", "app.py"]

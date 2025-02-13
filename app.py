from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama
import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://aiapp-frontend.onrender.com"}})


# Configure logging
logging.basicConfig(level=logging.DEBUG)

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "https://aiapp-frontend.onrender.com"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'CORS ok'}), 200

    data = request.get_json()  # Get input data from the frontend
    if not data or 'input' not in data:
        logging.error('No input data provided')
        return jsonify({'error': 'No input data provided'}), 400

    # Get the model's response
    try:
        logging.debug(f"Input data: {data['input']}")
        response = ollama.chat(
            model='deepseek-r1:1.5b', 
            messages=[{'role': 'user', 'content': data['input']}]
            )
        logging.debug(f"Response type: {type(response)}")  # Print the type of the response
        logging.debug(f"Response dir: {dir(response)}")  # Print the attributes of the response
        logging.debug(f"Response: {response}")  # Print the response to debug

        # Print the response attributes and content
        if hasattr(response, 'message'):
            logging.debug(f"Response message: {response.message}")
            prediction = response.message.get('content', 'No content attribute found')
        else:
            logging.debug(f"Response attributes: {dir(response)}")
            prediction = 'No message attribute found'
    except AttributeError as e:
        logging.error(f"AttributeError: {e}")
        return jsonify({'error': f"AttributeError: {e}"}), 500
    except Exception as e:
        logging.error(f"Exception: {e}")
        return jsonify({'error': f"Exception: {e}"}), 500

    return jsonify({'prediction': prediction})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import voice_analyse
import text_analyse
import numpy as np


app = Flask(__name__)
CORS(app)

# Path to the test audio files upload directory
app.config['UPLOAD_FOLDER'] = 'testUploads/'
# Extension that accepted to be uploaded
app.config['ALLOWED_EXTENSIONS'] = set(['wav', 'mp3'])


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


def get_analyse_detection(audio_file, transcribed_audio_data):

    # Perform analysis
    voice_analyse_result = voice_analyse.classify_audio(audio_file) 
    text_analyse_result = text_analyse.classify_audio(audio_file, transcribed_audio_data)
    print(f"Voice Analysis Result: {voice_analyse_result}")
    print(f"Text Analysis Result: {text_analyse_result}")
    # Combine predictions using weighted sum
    combined_prediction = 0.6 * voice_analyse_result + 0.4 * text_analyse_result

    threshold = 0.5

    # Check if combined prediction exceeds the threshold
    if combined_prediction >= threshold:
        return "SPAM"
    else:
        return "LEGIT"


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        print('No file part')
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        print('No selected file')
        return 'No selected file', 400
    print(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
    return 'File uploaded successfully', 200


@app.route('/deleteAudio/<filename>', methods=['DELETE'])
def delete_file(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(file_path):
        os.remove(file_path)
        return 'File deleted successfully', 200
    else:
        return 'File not found', 404


@app.route('/transcribe', methods=['POST'])
def transcribe_file():
    if request.method == 'POST':
        # Check if the request has JSON body
        if not request.is_json:
            return jsonify({"error": "JSON data not found"}), 400
        
        # Get data from JSON body
        data = request.get_json()
        
        # Check if required data is present
        if 'audioName' not in data:
            return jsonify({"error": "audioName not found in JSON body"}), 400
        
        # Construct the file path
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], data['audioName'])
        
        # Check if the file exists
        if not os.path.isfile(filepath):
            return jsonify({"error": "File not found"}), 404
        
        result = text_analyse.transcribe_audio(filepath)

        # Send success response with result
        return jsonify({"result": result}), 200
    else:
        return jsonify({"error": "Method not allowed"}), 405
    

@app.route('/detectAudio', methods=['POST'])
def detectAudio():
    if request.method == 'POST':
        # Check if the request has JSON body
        if not request.is_json:
            return jsonify({"error": "JSON data not found"}), 400
        
        # Get data from JSON body
        data = request.get_json()
        
        # Check if required data is present
        if 'audioName' and 'transcribedAudioData' not in data:
            return jsonify({"error": "Required data not found in JSON body"}), 400
        
        # Construct the file path
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], data['audioName'])

        transcribed_audio_data = data['transcribedAudioData']
        
        # Check if the file exists
        if not os.path.isfile(filepath):
            return jsonify({"error": "File not found"}), 404
        
        result = get_analyse_detection(filepath, transcribed_audio_data)

        # Send success response with result
        return jsonify({"result": result}), 200
    else:
        return jsonify({"error": "Method not allowed"}), 405

if __name__ == '__main__':
    app.run(debug=True)

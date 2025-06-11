import numpy as np
import deepspeech
import wave
import joblib


nlp_model_path = 'model/spam_audio_text_classifier_model.pkl'
vectorizer_path = 'model/tfidf_vectorizer.pkl'
deep_speech_model_path = 'model/deepspeech-0.9.3-models.pbmm'

deepspeech_model = deepspeech.Model(deep_speech_model_path)

def load_model(model_filename, vectorizer_filename):
    try:
        # Load the trained model
        model = joblib.load(model_filename)
        print("Model loaded successfully.")

        # Load the TF-IDF vectorizer
        vectorizer = joblib.load(vectorizer_filename)
        print("Vectorizer loaded successfully.")

        return model, vectorizer
    except Exception as e:
        print(f"Error loading model or vectorizer: {e}")
        return None, None


def transcribe_audio(audio_file):
    try:
        # Load the audio file
        audio = wave.open(audio_file, 'rb')
        audio_data = audio.readframes(audio.getnframes())

        # Perform speech-to-text transcription
        text = deepspeech_model.stt(np.frombuffer(audio_data, np.int16))

        # Close the audio file
        audio.close()

        return text
    except Exception as e:
        print(f"Error transcribing audio '{audio_file}': {e}")
        return ""


def classify_audio(audio_file, transcribed_audio_data):

    nlp_model, vectorizer = load_model(nlp_model_path, vectorizer_path)

    if nlp_model and vectorizer:

        try:
            if transcribed_audio_data:
                # Transform the text using the vectorizer
                X = vectorizer.transform([transcribed_audio_data]).toarray()

                # Predict using the model
                prediction = nlp_model.predict(X)
                return prediction[0]
            else:
                return "No transcribed audio data found"
        except Exception as e:
            print(f"Error predicting audio '{audio_file}': {e}")
            return "Error"

    else:
        print("Model or vectorizer not loaded")
        return "Error loading model"
import librosa
import numpy as np
import joblib


# Path to the classifier model
model_file_path = 'model/spam_audio_classifier_model.pkl'
# Load the model
classifier = joblib.load(model_file_path)

# Function to extract features from audio files
def extract_features(file_path, label):
    try:
        # Load audio file
        y, sr = librosa.load(file_path, sr=None)
        
        # Extract features
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
        spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
        spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
        zero_crossing_rate = librosa.feature.zero_crossing_rate(y)
        
        # Concatenate features
        features = np.concatenate((
            np.mean(mfccs, axis=1),
            np.mean(spectral_centroid, axis=1),
            np.mean(spectral_bandwidth, axis=1),
            np.mean(spectral_rolloff, axis=1),
            np.mean(zero_crossing_rate, axis=1)
        ))
        
        return features, label
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None, None


# Function to classify input audio file
def classify_audio(audio_file):
    # Extract features from the audio file
    features, _ = extract_features(audio_file, label=None)
    if features is not None:
        # Reshape features array to match the input format for prediction
        features = features.reshape(1, -1)
        # Predict using the trained classifier
        prediction = classifier.predict(features)
        return prediction
    else:
        print(f"Error processing '{audio_file}'.")
        return 'ERROR'

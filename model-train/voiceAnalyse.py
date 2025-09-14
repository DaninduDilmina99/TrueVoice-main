import os
import numpy as np
import librosa
# from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC  
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score, roc_auc_score, roc_curve
import matplotlib.pyplot as plt
import seaborn as sns
import joblib


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


# Train and test function
def train_and_test():
    # Paths to the directories containing audio files
    legit_directory = 'Legit calls'
    spam_directory = 'Spam calls'
    
    # Lists to store extracted features and corresponding labels
    features = []
    labels = []
    
    # Extract features from legit audio files
    for filename in os.listdir(legit_directory):
        if filename.endswith('.wav'):
            file_path = os.path.join(legit_directory, filename)
            feature, label = extract_features(file_path, label=0)
            if feature is not None:
                features.append(feature)
                labels.append(label)
    
    # Extract features from spam audio files
    for filename in os.listdir(spam_directory):
        if filename.endswith('.wav'):
            file_path = os.path.join(spam_directory, filename)
            feature, label = extract_features(file_path, label=1)
            if feature is not None:
                features.append(feature)
                labels.append(label)
    
    # Convert lists to numpy arrays
    x = np.array(features)
    y = np.array(labels)
    
    # Split data into train and test sets
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=0)
    
    # Train the classifier with regularization
    classifier = SVC(kernel='rbf', random_state=0)
    classifier.fit(x_train, y_train)
    
    # Predict on test set
    y_pred = classifier.predict(x_test)
    
    # Calculate confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    
    # Plot confusion matrix
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=['Legit', 'Spam'], yticklabels=['Legit', 'Spam'])
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.title('Confusion Matrix')
    plt.show()
    
    print('*********************************')
    
    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print("Accuracy:", accuracy)
    print('*********************************')
    
    # Calculate F1 score
    f1 = f1_score(y_test, y_pred)
    print("F1 Score:", f1)
    print('*********************************')
    
    # Calculate precision
    precision = precision_score(y_test, y_pred)
    print("Precision:", precision)
    print('*********************************')
    
    # Calculate recall
    recall = recall_score(y_test, y_pred)
    print("Recall:", recall)
    print('*********************************')
    
    # Calculate AUC/ROC Curve
    roc_auc = roc_auc_score(y_test, y_pred)
    print("AUC/ROC:", roc_auc)
    
    fpr, tpr, thresholds = roc_curve(y_test, y_pred)
    plt.plot(fpr, tpr, label='AUC = %0.2f' % roc_auc)
    plt.plot([0, 1], [0, 1],'r--')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver Operating Characteristic (ROC) Curve')
    plt.legend(loc="lower right")
    plt.show()

    return classifier


# Function to classify input audio file
def classify_audio(file_path, classifier):
    # Extract features from the audio file
    features, _ = extract_features(file_path, label=None)
    if features is not None:
        # Reshape features array to match the input format for prediction
        features = features.reshape(1, -1)
        # Predict using the trained classifier
        prediction = classifier.predict(features)
        if prediction == 0:
            print(f"The audio file '{file_path}' is classified as LEGIT call.")
        else:
            print(f"The audio file '{file_path}' is classified as SPAM call.")
    else:
        print(f"Error processing '{file_path}'.")


# Train and test the classifier
classifier = train_and_test()

# Path to save the trained model
model_file_path = 'spam_classifier_model.pkl'

# Save the model
joblib.dump(classifier, model_file_path)

# Path to the input audio file for classification
audio_file_path = '211187_normalized.wav' 
classify_audio(audio_file_path, classifier)

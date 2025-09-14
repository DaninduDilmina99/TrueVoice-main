import os
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.linear_model import LogisticRegression
# from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC  
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score, roc_auc_score, roc_curve
import matplotlib.pyplot as plt
import deepspeech
import wave
import seaborn as sns
from tqdm import tqdm
import joblib 


# Function to create the DeepSpeech model
def create_deepspeech_model(model_path):
    return deepspeech.Model(model_path)


# Transcribe audio files to text using Mozilla DeepSpeech
def transcribe_audio(audio_file_name, input_audio_dir, model):
    try:
        # Define paths to the input and output files
        full_audio_file_path = os.path.join(input_audio_dir, audio_file_name)

        # Load the audio file
        audio = wave.open(full_audio_file_path, 'rb')

        # Read audio data
        audio_data = audio.readframes(audio.getnframes())

        # Perform speech-to-text transcription
        text = model.stt(np.frombuffer(audio_data, np.int16))

        # Close the audio file
        audio.close()

        return text
    except Exception as e:
        print(f"Error processing '{full_audio_file_path}': {e}")
        return ""
    

# Create the DeepSpeech model
model_path = 'deepspeech-0.9.3-models.pbmm'
model = create_deepspeech_model(model_path)

# Define directories containing spam and legitimate audio files
spam_dir = 'Spam calls'
legit_dir = 'Legit edit'

# Initialize lists to store transcribed texts and labels
all_texts = []
all_labels = []

# Transcribe spam audio files
print("Transcribing spam audio files:")
spam_files = [file for file in os.listdir(spam_dir) if file.endswith('.wav')]
for i, filename in enumerate(tqdm(spam_files, desc="Spam Files")):
    text = transcribe_audio(filename, spam_dir, model)
    if text:
        all_texts.append(text)
        # Label for spam
        all_labels.append(1)  

# Transcribe legitimate audio files
print("Transcribing legitimate audio files:")
legit_files = [file for file in os.listdir(legit_dir) if file.endswith('.wav')]
for i, filename in enumerate(tqdm(legit_files, desc="Legitimate Files")):
    text = transcribe_audio(filename, legit_dir, model)
    if text:
        all_texts.append(text)
        # Label for legitimate
        all_labels.append(0)  
        
# Save all_texts and all_labels
data_filename = 'audio_texts_and_labels.pkl'
joblib.dump((all_texts, all_labels), data_filename)
print(f"All texts and labels saved as {data_filename}")


# Convert text data to TF-IDF features
vectorizer = TfidfVectorizer(max_features=1000) 
X = vectorizer.fit_transform(all_texts).toarray()
y = np.array(all_labels)

# Split data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)


# Initialize and train the model
classifier = SVC(kernel='rbf', C=0.12, random_state=0)
classifier.fit(X_train, y_train)

# Save the trained model
model_filename = 'spam_detection_nlp_model.pkl'
joblib.dump(classifier, model_filename)
print(f"Model saved as {model_filename}")

# Save the TF-IDF vectorizer
vectorizer_filename = 'tfidf_vectorizer.pkl'
joblib.dump(vectorizer, vectorizer_filename)
print(f"Vectorizer saved as {vectorizer_filename}")

# Predict on test set
y_pred = classifier.predict(X_test)

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


# Path to the input a audio file for classification
audio_file_path = '211187_normalized.wav' 
current_folder_path = os.getcwd()
text_data = transcribe_audio(audio_file_path, current_folder_path, model)
X = vectorizer.transform([text_data]).toarray()
prediction = classifier.predict(X)
if prediction == 0:
    print(f"The audio file '{audio_file_path}' is classified as LEGIT call.")
else:
    print(f"The audio file '{audio_file_path}' is classified as SPAM call.")

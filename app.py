from flask import Flask, render_template, request, jsonify, send_from_directory
from googletrans import Translator
import pyttsx3
from gtts import gTTS
import os


app = Flask(__name__)
translator = Translator()
engine = pyttsx3.init()

# Initialize settings
language_voice_map = {
    'en': 'com.apple.speech.synthesis.voice.Alex',  # Example for English
    'hi': 'hindi',  # Example for Hindi
    'ta': 'tamil',  # Example for Tamil
    'te': 'telugu',  # Example for Telugu
    'bn': 'bengali',  # Example for Bengali
    'gu': 'gujarati',  # Example for Gujarati
    'kn': 'kannada',  # Example for Kannada
    'ml': 'malayalam',  # Example for Malayalam
    'mr': 'marathi',  # Example for Marathi
    'pa': 'punjabi',  # Example for Punjabi
    'or': 'odia',  # Example for Odia
    'as': 'assamese',  # Example for Assamese
    'ur': 'ur'  # Example for Urdu
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate():
    text = request.form['text']
    dest_language = request.form['dest_language']
    
    # Use user-provided source language for translation
    source_language = request.form['source_language']

    # Perform translation
    translated = translator.translate(text, src=source_language, dest=dest_language)
    return jsonify(translated_text=translated.text)

@app.route('/convert_to_speech', methods=['POST'])
def convert_to_speech():
    text = request.form['text']
    language_code = request.form['language_code']
    engine_choice = request.form['engine_choice']  # Select between pyttsx3 and gTTS
    rate = int(request.form['rate'])
    volume = float(request.form['volume'])

    # Adjust speech settings
    engine.setProperty('rate', rate)
    engine.setProperty('volume', volume)

    filename = 'output.mp3'  # Specify the file name

    if engine_choice == 'pyttsx3':
        voice = language_voice_map.get(language_code, 'en')
        engine.setProperty('voice', voice)
        engine.save_to_file(text, filename)
        engine.runAndWait()
    else:
        tts = gTTS(text=text, lang=language_code)
        tts.save(filename)

    return jsonify({'filename': filename})

@app.route('/save', methods=['POST'])
def save():
    text = request.form['text']
    file_format = request.form['file_format']
    filename = f'text_output.{file_format}'
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(text)
    return jsonify({'filename': filename})

@app.route('/download/<filename>')
def download(filename):
    return send_from_directory('.', filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)

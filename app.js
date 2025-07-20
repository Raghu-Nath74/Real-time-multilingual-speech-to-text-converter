let recognition;
const textInput = document.getElementById('text-input');
const recordBtn = document.getElementById('record-btn');
const inputLanguage = document.getElementById('input-language');
const downloadLink = document.getElementById('download-link');

function initSpeechRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.lang = inputLanguage.value; // Set language based on user selection
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        textInput.value = event.results[0][0].transcript;
        recognition.stop();
        recordBtn.classList.remove('recording');
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event);
        recognition.stop();
    };
}

recordBtn.addEventListener('click', () => {
    initSpeechRecognition();
    recognition.start();
    recordBtn.classList.add('recording');
});

document.getElementById('translate-btn').addEventListener('click', function() {
    const text = document.getElementById('text-input').value;
    const destLanguage = document.getElementById('output-language').value;
    const sourceLanguage = inputLanguage.value; // Get selected input language

    fetch('/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'text': text,
            'dest_language': destLanguage,
            'source_language': sourceLanguage  // Include source language
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('translated-text').value = data.translated_text;
    });
});

document.getElementById('speech-btn').addEventListener('click', function() {
    const text = document.getElementById('translated-text').value || textInput.value;
    const languageCode = inputLanguage.value; // Use the input language for TTS
    const engineChoice = document.getElementById('engine-choice').value;
    const rate = document.getElementById('rate').value;
    const volume = document.getElementById('volume').value;

    fetch('/convert_to_speech', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'text': text,
            'language_code': languageCode,
            'engine_choice': engineChoice,
            'rate': rate,
            'volume': volume
        })
    })
    .then(response => response.json())
    .then(data => {
        downloadLink.href = `/download/${data.filename}`;
        downloadLink.innerText = 'Download Speech';
        downloadLink.style.display = 'inline-block'; // Show the download link
        document.getElementById('audio').src = `/download/${data.filename}`;
        document.getElementById('audio').style.display = 'block'; // Show the audio controls
    });
});

document.getElementById('save-input-btn').addEventListener('click', function() {
    const text = document.getElementById('text-input').value;
    const format = 'txt'; // You can change this to your desired format

    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'text': text,
            'file_format': format
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(`Input saved as: ${data.filename}`);
    });
});

document.getElementById('save-translation-btn').addEventListener('click', function() {
    const text = document.getElementById('translated-text').value;
    const format = 'txt'; // You can change this to your desired format

    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'text': text,
            'file_format': format
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(`Translation saved as: ${data.filename}`);
    });
});

let isSpeaking = false;
const speechSynth = window.speechSynthesis || null;

function speakQuote(text, source) {
    if (!speechSynth || !text) return;
    
    // Cancel any ongoing speech
    speechSynth.cancel();
    
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = `${text} — From ${source}`;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Update UI
    const speakBtn = document.getElementById('speakQuote');
    speakBtn.textContent = '⏹️ Stop';
    speakBtn.setAttribute('aria-label', 'Stop speaking');
    isSpeaking = true;
    
    // Visual feedback
    document.getElementById('wisdomDisplay').setAttribute('data-speaking', 'true');
    
    utterance.onend = utterance.onerror = () => {
        isSpeaking = false;
        speakBtn.textContent = '🔊 Speak';
        speakBtn.setAttribute('aria-label', 'Speak quote');
        document.getElementById('wisdomDisplay').removeAttribute('data-speaking');
    };
    
    speechSynth.speak(utterance);
}

function toggleSpeak() {
    const quoteText = document.getElementById('quoteText').textContent;
    const quoteSource = document.getElementById('quoteSource').textContent;
    
    if (isSpeaking) {
        speechSynth.cancel();
    } else {
        speakQuote(quoteText.replace(/^"|"$/g, ''), 
                  quoteSource.replace(/^- /, ''));
    }
}

// Initialize TTS button
document.addEventListener('DOMContentLoaded', () => {
    const speakBtn = document.getElementById('speakQuote');
    if (!speechSynth) {
        speakBtn.disabled = true;
        speakBtn.textContent = '🔊 Unavailable';
    } else {
        speakBtn.addEventListener('click', toggleSpeak);
    }
});

import React, { useState, useEffect, useRef } from 'react';
import { HiMicrophone, HiStop } from 'react-icons/hi';

const VoiceInput = ({ onTranscript, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const fullTranscript = finalTranscript || interimTranscript;
      setTranscript(fullTranscript);

      if (finalTranscript && onTranscript) {
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!supported) {
    return (
      <div className="text-xs text-gray-500 italic mt-1">
        🎤 Voice input is not supported in this browser
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
          isListening
            ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse-glow shadow-lg shadow-red-500/20'
            : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:border-white/20'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        id="voice-input-toggle"
      >
        {isListening ? (
          <>
            <HiStop className="text-lg" />
            Stop Recording
          </>
        ) : (
          <>
            <HiMicrophone className="text-lg" />
            Voice Input
          </>
        )}
      </button>

      {isListening && transcript && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-300 animate-fade-in">
          <span className="text-xs text-brand-400 font-medium block mb-1">Live transcript:</span>
          {transcript}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;

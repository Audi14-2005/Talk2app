// hooks/useVoiceRecording.js
import { useState, useRef } from 'react';
import { Audio } from 'expo-av';
import * as SpeechRecognizer from 'expo-speech'; // optional fallback
import * as FileSystem from 'expo-file-system';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceInput, setVoiceInput] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('hi');
  const [audioLevel, setAudioLevel] = useState(0);

  const recordingRef = useRef(null);
  const audioIntervalRef = useRef(null);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;

      // Simulate audio level changes
      audioIntervalRef.current = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 100));
      }, 300);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsTranscribing(true);

      clearInterval(audioIntervalRef.current);
      setAudioLevel(0);

      const recording = recordingRef.current;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      // Simulate transcription
      const dummyTranscript = 'Cotton saree with traditional design';
      const dummyLang = 'hi';

      setTimeout(() => {
        setVoiceInput('सूती साड़ी पारंपरिक डिज़ाइन के साथ');
        setTranslatedText(dummyTranscript);
        setDetectedLanguage(dummyLang);
        setIsTranscribing(false);
      }, 1500); // simulate delay

    } catch (err) {
      console.error('Failed to stop recording', err);
      setIsTranscribing(false);
    }
  };

  const clearInput = () => {
    setVoiceInput('');
    setTranslatedText('');
    setDetectedLanguage('');
  };

  return {
    isRecording,
    isTranscribing,
    audioLevel,
    voiceInput,
    translatedText,
    detectedLanguage,
    startRecording,
    stopRecording,
    clearInput,
  };
};

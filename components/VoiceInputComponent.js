import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useVoiceRecording } from '../hooks/useVoiceRecording';

const VoiceInput = ({ onTextEdit, onGenerate }) => {
  const {
    isRecording,
    isTranscribing,
    audioLevel,
    voiceInput,
    translatedText,
    detectedLanguage,
    startRecording,
    stopRecording,
    clearInput,
  } = useVoiceRecording();

  const handleGenerate = () => {
    if (translatedText) {
      onGenerate(translatedText, voiceInput);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🔊 Speak to Add Product</Text>
        {(voiceInput || translatedText) && (
          <TouchableOpacity onPress={clearInput} style={styles.clearBtn}>
            <Icon name="x" size={16} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Mic Button */}
      <View style={styles.center}>
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          disabled={isTranscribing}
          style={[
            styles.micButton,
            isRecording ? styles.micActive : styles.micIdle,
          ]}
        >
          {isTranscribing ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : isRecording ? (
            <Icon name="mic-off" size={32} color="#fff" />
          ) : (
            <Icon name="mic" size={32} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Audio Level */}
      {isRecording && (
        <View style={{ marginVertical: 16 }}>
          <View style={styles.audioBar}>
            <Animated.View
              style={[
                styles.audioFill,
                { width: `${Math.min(audioLevel, 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.recordingText}>Recording...</Text>
        </View>
      )}

      {/* Original Voice Input */}
      {voiceInput !== '' && (
        <View style={styles.voiceBox}>
          <View style={styles.voiceHeader}>
            <Icon name="volume-2" size={16} color="#2563eb" />
            <Text style={styles.voiceLabel}>Your Input:</Text>
            <Text style={styles.languageTag}>
              {detectedLanguage?.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.voiceText}>{voiceInput}</Text>
        </View>
      )}

      {/* Translated Text */}
      {translatedText !== '' && (
        <View style={styles.translationBox}>
          <View style={styles.voiceHeader}>
            <Icon name="globe" size={16} color="#059669" />
            <Text style={styles.voiceLabel}>English Translation:</Text>
          </View>
          <Text style={styles.voiceText}>{translatedText}</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.editBtn} onPress={onTextEdit}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
              <View style={styles.flexRow}>
                <Icon name="star" size={16} color="#fff" />
                <Text style={styles.generateText}>Generate</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Manual Input Option */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={onTextEdit} style={styles.textOption}>
          <Icon name="edit-3" size={16} color="#4b5563" />
          <Text style={styles.textOptionText}>Or type manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  clearBtn: {
    padding: 6,
  },
  center: {
    alignItems: 'center',
    marginBottom: 24,
  },
  micButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIdle: {
    backgroundColor: '#10b981',
  },
  micActive: {
    backgroundColor: '#ef4444',
    transform: [{ scale: 1.1 }],
  },
  audioBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  audioFill: {
    height: '100%',
    backgroundColor: '#ef4444',
  },
  recordingText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 6,
  },
  voiceBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  translationBox: {
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  voiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  voiceLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
    color: '#374151',
  },
  languageTag: {
    marginLeft: 8,
    fontSize: 11,
    backgroundColor: '#dbeafe',
    color: '#1e3a8a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  voiceText: {
    color: '#1f2937',
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  editBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#10b981',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editText: {
    color: '#10b981',
    fontWeight: '500',
  },
  generateBtn: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 6,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
    marginTop: 12,
  },
  textOption: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  textOptionText: {
    color: '#4b5563',
    fontWeight: '500',
    marginLeft: 6,
  },
});

export default VoiceInput;

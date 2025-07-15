import React from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { AppSettings, SettingsService } from '../services/settingsService';
import { supportedLanguages } from '../services/languageDetection';
import { NotificationService } from '../services/notificationService';

const SettingsScreen = ({ onBack, settings, onSettingsChange }) => {
  const updateSetting = (key, value) => {
    const newSettings = SettingsService.updateSetting(key, value);
    onSettingsChange(newSettings);
    if (key === 'notifications' && value) {
      NotificationService.success('Notifications enabled');
    }
  };

  const resetSettings = () => {
    const defaultSettings = SettingsService.resetSettings();
    onSettingsChange(defaultSettings);
    NotificationService.info('Settings reset to defaults');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton}>
          <Icon name="arrow-left" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity onPress={resetSettings} style={styles.iconButton}>
          <Icon name="rotate-ccw" size={20} />
        </TouchableOpacity>
      </View>

      {/* Toggle Section */}
      {[
        {
          key: 'notifications',
          label: 'Smart Notifications',
          description: 'Get reminders for inventory',
          icon: 'bell',
        },
        {
          key: 'autoDetectLanguage',
          label: 'Auto Language Detection',
          description: 'Automatically detect spoken language',
          icon: 'globe',
        },
        {
          key: 'kioskMode',
          label: 'Kiosk Mode',
          description: 'Fullscreen interface',
          icon: 'monitor',
        },
        {
          key: 'offlineMode',
          label: 'Offline Mode',
          description: 'Work without internet',
          icon: 'wifi',
        },
      ].map(({ key, label, description, icon }) => (
        <View key={key} style={styles.card}>
          <View style={styles.row}>
            <Icon name={icon} size={20} style={styles.icon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{label}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
            <Switch
              value={settings[key]}
              onValueChange={(value) => updateSetting(key, value)}
            />
          </View>
        </View>
      ))}

      {/* Voice Sensitivity */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Icon name="volume-2" size={20} style={styles.icon} />
          <View>
            <Text style={styles.title}>Voice Sensitivity</Text>
            <Text style={styles.description}>Adjust microphone sensitivity</Text>
          </View>
        </View>
        <Slider
          style={{ width: '100%', marginTop: 10 }}
          minimumValue={0}
          maximumValue={1}
          step={0.1}
          value={settings.voiceSensitivity}
          onValueChange={(value) => updateSetting('voiceSensitivity', value)}
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderText}>Low</Text>
          <Text style={styles.sliderText}>High</Text>
        </View>
      </View>

      {/* Language Picker */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Icon name="globe" size={20} style={styles.icon} />
          <Text style={styles.title}>Default Voice Language</Text>
        </View>
        <Picker
          selectedValue={settings.language}
          onValueChange={(itemValue) => updateSetting('language', itemValue)}
        >
          {supportedLanguages.map((lang) => (
            <Picker.Item
              key={lang.code}
              label={`${lang.nativeName} (${lang.name})`}
              value={lang.code}
            />
          ))}
        </Picker>
      </View>

      {/* Theme Picker */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Icon name="settings" size={20} style={styles.icon} />
          <Text style={styles.title}>Theme</Text>
        </View>
        <Picker
          selectedValue={settings.theme}
          onValueChange={(value) => updateSetting('theme', value)}
        >
          <Picker.Item label="Light" value="light" />
          <Picker.Item label="Dark" value="dark" />
          <Picker.Item label="System" value="system" />
        </Picker>
      </View>

      {/* App Info */}
      <View style={styles.card}>
        <Text style={styles.title}>App Information</Text>
        <View style={styles.infoRow}>
          <Text>Version</Text>
          <Text>2.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text>Storage Used</Text>
          <Text>3.2 MB</Text>
        </View>
        <View style={styles.infoRow}>
          <Text>Last Sync</Text>
          <Text>{new Date().toLocaleDateString()}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  iconButton: {
    padding: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
    color: '#3b82f6',
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sliderText: {
    fontSize: 12,
    color: '#6b7280',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
});

export default SettingsScreen;

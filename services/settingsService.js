import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'talk2trade-settings';

export const defaultSettings = {
  notifications: true,
  kioskMode: false,
  offlineMode: true,
  language: 'hi',
  autoDetectLanguage: true,
  theme: 'light',
  voiceSensitivity: 0.5,
};

export const SettingsService = {
  async getSettings() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load settings from AsyncStorage:', error);
    }
    return defaultSettings;
  },

  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings to AsyncStorage:', error);
    }
  },

  async updateSetting(key, value) {
    const current = await this.getSettings();
    const updated = { ...current, [key]: value };
    await this.saveSettings(updated);
    return updated;
  },

  async resetSettings() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
    return defaultSettings;
  },
};

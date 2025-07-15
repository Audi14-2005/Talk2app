import { Alert, Platform, ToastAndroid } from 'react-native';

export const NotificationService = {
  show({ title, description, type = 'info', duration = 3000 }) {
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(
        `${title ? `${title}: ` : ''}${description}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } else {
      Alert.alert(title || type.toUpperCase(), description);
    }
  },

  success(description, title) {
    this.show({ title: title || 'Success', description, type: 'success' });
  },

  error(description, title) {
    this.show({ title: title || 'Error', description, type: 'error' });
  },

  warning(description, title) {
    this.show({ title: title || 'Warning', description, type: 'warning' });
  },

  info(description, title) {
    this.show({ title: title || 'Info', description, type: 'info' });
  },

  productAdded(productName) {
    this.success(`${productName} has been added successfully!`, 'Product Added');
  },

  productUpdated(productName) {
    this.success(`${productName} has been updated successfully!`, 'Product Updated');
  },

  productDeleted(productName) {
    this.warning(`${productName} has been deleted.`, 'Product Deleted');
  },

  languageDetected(language, confidence) {
    this.info(`Detected ${language} (${Math.round(confidence * 100)}% confidence)`, 'Language Detected');
  },

  offlineMode() {
    this.warning('You are working offline. Changes will sync when connection is restored.', 'Offline Mode');
  },

  syncComplete() {
    this.success('All changes have been synced successfully!', 'Sync Complete');
  }
};

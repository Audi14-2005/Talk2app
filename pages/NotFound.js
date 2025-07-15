// components/NotFoundScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const NotFoundScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', route?.name);
  }, [route?.name]);

  const handleGoHome = () => {
    navigation.navigate('Home'); // Make sure 'Home' is defined in your navigator
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.message}>Oops! Page not found</Text>
        <TouchableOpacity onPress={handleGoHome}>
          <Text style={styles.link}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotFoundScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // gray-100
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    alignItems: 'center',
    padding: 24,
  },
  code: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827', // gray-900
  },
  message: {
    fontSize: 18,
    color: '#4b5563', // gray-600
    marginBottom: 16,
  },
  link: {
    fontSize: 16,
    color: '#3b82f6', // blue-500
    textDecorationLine: 'underline',
  },
});

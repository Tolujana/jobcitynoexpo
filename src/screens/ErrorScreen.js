import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const ErrorScreen = ({navigation}) => {
  const navigateToSettings = () => {
    navigation.navigate('Settings'); // Navigate to the Settings screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You do not have enough reward points</Text>
      <Text style={styles.message}>
        Please go to the settings page for more information.
      </Text>
      <TouchableOpacity style={styles.button} onPress={navigateToSettings}>
        <Text style={styles.buttonText}>Go to Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorScreen;

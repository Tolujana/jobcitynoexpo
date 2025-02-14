import React from 'react';
import {Button, View, Alert} from 'react-native';
import notifee from '@notifee/react-native';

const SendNotification = () => {
  // Function to display a notification when the button is pressed
  const sendNotification = async () => {
    try {
      // Requesting permission to send notifications (iOS specific)
      await notifee.requestPermission();

      // Define the notification details
      const notification = {
        title: 'Test Notification',
        body: 'This is a test notification triggered by button press.',
        android: {
          channelId: 'default', // Ensure this channel is created (it could be default)
          smallIcon: 'ic_launcher', // Make sure this icon exists in the drawable folder
          pressAction: {
            id: 'default',
          },
        },
        data: {
          search: 'job', // Custom data you want to send
          post_title: 'Payable Accountant at Perfetti Van Melle',
        },
      };

      // Display the notification
      await notifee.displayNotification(notification);
      Alert.alert(
        'Notification Sent',
        'Your notification has been sent successfully!',
      );
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert('Error', 'Failed to send notification.');
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button title="Send Notification" onPress={sendNotification} />
    </View>
  );
};

export default SendNotification;

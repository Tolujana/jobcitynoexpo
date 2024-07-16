import notifee, { AndroidImportance,AuthorizationStatus } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundFetch from 'react-native-background-fetch';

const BackgroundFetchTask = async () => {
    console.log("[BackgroundFetch] Task executed");

    try {
        const jsonValue = await AsyncStorage.getItem('apiList');
        const apiList = jsonValue != null ? JSON.parse(jsonValue) : {};

        for (const [name, url] of Object.entries(apiList)) {
            const response = await fetch(url);
            const data = await response.json();
            const latestArticle = data[0]; // Adjust based on API response structure

            const lastDate = await AsyncStorage.getItem(`lastDate_${name}`);
            if (lastDate !== latestArticle.date) {
                await AsyncStorage.setItem(`lastDate_${name}`, latestArticle.date);
                sendNotification(name, url);
            }
        }
    } catch (error) {
        console.error(error);
    }

    BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
};

const sendNotification = async (name, url) => {
    // Create a channel (required for Android)
    const authorizationStatus = await Notifee.requestPermission({
        provisional: true, // Optional for Android 13
      });
    
      if (authorizationStatus === AuthorizationStatus.AUTHORIZED) {
        console.log('Notification permission granted');
        await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
        });
    
        // Display a notification
        await notifee.displayNotification({
            title: `New Article from ${name}`,
            body: `Check out the new content at: ${url}`,
            android: {
                channelId: 'default',
            },
        });
      } else {
        console.log('Notification permission denied');
      }
   
};

export default BackgroundFetchTask;

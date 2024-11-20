/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';
import BackgroundFetch from 'react-native-background-fetch';
import notifee, {EventType} from '@notifee/react-native';
import {navigationRef} from './src/navigation/NotificationNavigate';
import backgroundFetchTask from './src/components/BackgroundFetchTask';

PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

const headlessTask = async event => {
  console.log('[BackgroundFetch HeadlessTask] event: ', event.taskId);
  await backgroundFetchTask();
  BackgroundFetch.finish(event.taskId);
};

notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === EventType.PRESS) {
    handleNotificationPress(detail.notification.data);
  }
});

const handleNotificationPress = data => {
  // Ensure data contains the screen and other params
  if (data && data.keyWord) {
    navigationRef.current?.navigate('Listing', {
      search: data.keyWord,
    });
  }
};

BackgroundFetch.registerHeadlessTask(headlessTask);
AppRegistry.registerComponent(appName, () => App);

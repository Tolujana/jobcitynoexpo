/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';
// import configureBackgroundFetch from './src/util/BackgroundTask';
import BackgroundFetch from 'react-native-background-fetch';

PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

const headlessTask = async event => {
  console.log('[BackgroundFetch HeadlessTask] event: ', event.taskId);
  await configureBackgroundFetch();
  BackgroundFetch.finish(event.taskId);
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

BackgroundFetch.registerHeadlessTask(headlessTask);
AppRegistry.registerComponent(appName, () => App);

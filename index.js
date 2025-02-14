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
import {SplashProvider} from './src/context/SplashContext';
import messaging from '@react-native-firebase/messaging';
import {hasRewardPoints} from './src/util/funtions';

import {AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Notifee background event handler
// notifee.onBackgroundEvent(async ({type, detail}) => {
//   console.log('Notifee background event', type, detail);

//   if (type === EventType.PRESS) {
//     console.log('notifee in index');
//     // Handle Notifee notification data
//     const keyword = detail?.data?.keyword; // Notifee uses "keyword" instead of "post_category"
//     const post_title = detail?.data?.post_title; // Assuming "post_title" is common between both

//     if (keyword && post_title) {
//       console.log('Storing Notifee notification data for later use');
//       pendingNotificationData = {keyword, post_title}; // Store Notifee data for navigation
//     }
//   }
// });

// notifee.onBackgroundEvent(async ({type, detail}) => {
//   console.log('Notifee Background Event Triggered:', type, detail);
//   //const hasPoints = await hasRewardPoints(3);

//   if (type === EventType.PRESS) {
//     console.log(
//       'Notification clicked while app is in background or killed.',
//       detail.notification.data,
//     );

//     const {keyword, post_title} = detail.notification.data || {};
//     if (keyword) {
//       console.log('Navigating to NewListing screen:', keyword, post_title);

//       // Store navigation data in AsyncStorage (used when the app is launched)
//       await AsyncStorage.setItem(
//         'pendingNotification',
//         JSON.stringify({keyword, post_title}),
//       );
//     }
//   }
// });

// Listen for app state changes to handle navigation when the app is active

PushNotification.configure({
  onNotification: function (notification) {
    // console.log('NOTIFICATION:', notification);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

const headlessTask = async event => {
  // console.log('[BackgroundFetch HeadlessTask] event: ', event.taskId);
  await backgroundFetchTask();
  BackgroundFetch.finish(event.taskId);
};

const Root = () => {
  return (
    // <SplashProvider>
    <App />
    // </SplashProvider>
  );
};
BackgroundFetch.registerHeadlessTask(headlessTask);
AppRegistry.registerComponent(appName, () => Root);

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

notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === EventType.PRESS) {
    handleNotificationPress(detail.notification.data);
  }
});
notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === notifee.EventType.PRESS) {
    const screen = detail.notification?.data?.screen;
    if (screen) {
      // Store the screen in AsyncStorage or a global variable to use after the app initializes
      global.pendingScreen = screen;
    }
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
const Root = () => {
  return (
    <SplashProvider>
      <App />
    </SplashProvider>
  );
};
BackgroundFetch.registerHeadlessTask(headlessTask);
AppRegistry.registerComponent(appName, () => Root);

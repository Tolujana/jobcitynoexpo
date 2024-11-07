/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
<<<<<<< HEAD
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  NativeModules,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {startTask} from './src/util/BackGroundAction';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import AppNavigation from './src/navigation';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import BackgroundFetch from 'react-native-background-fetch';
import BackgroundFetchTask from './src/components/BackgroundFetchTask';
=======
import {createNavigationContainerRef} from '@react-navigation/native';
import notifee, {EventType} from '@notifee/react-native';

import React, {useEffect, useState, useRef} from 'react';
import messaging from '@react-native-firebase/messaging';
import Event from './src/Event';
import {firebase} from '@react-native-firebase/app';
import {firebaseConfig} from './src/constants/Channels';
import {navigationRef} from './src/navigation/NotificationNavigate';
// import type {PropsWithChildren} from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  useColorScheme,
  Button,
  Alert,
  Linking,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import AppNavigation from './src/navigation';
import BackgroundFetchTask, {
  fetchArticles,
} from './src/components/BackgroundFetchTask';
import BackgroundFetch from 'react-native-background-fetch';
>>>>>>> latest

const requestNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Notification Permission',
        message: 'This app needs access to send you notifications.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission denied');
    }
  }
};

<<<<<<< HEAD
const requestNotificationPermissions = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Notification Permission',
        message: 'This app needs access to send you notifications.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

const queryClient = new QueryClient();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  React.useEffect(() => {
    //requestNotificationPermissions();

    const setupBackgroundFetch = async () => {
      const permissionGranted = await requestNotificationPermissions();
      if (permissionGranted) {
        // await notifee.createChannel({
        //   id: 'reminder',
        //   name: 'job',
        //   visibility: AndroidVisibility.PUBLIC,
        //   importance: AndroidImportance.HIGH,
        //   vibration: true,
        //   description: 'Reminder Notifications',
        // });
        await startTask();
        console.log(
          'Notification permission granted. Background fetch will start.',
        );
      } else {
        console.log(
          'Notification permission denied. Background fetch will not start.',
        );
      }
    };
    const permissionGranted = requestNotificationPermissions();
    if (permissionGranted) {
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 15, // Fetch interval in minutes
          stopOnTerminate: false,
          startOnBoot: true,
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
          requiresCharging: false,
          requiresDeviceIdle: false,
          requiresBatteryNotLow: false,
          requiresStorageNotLow: false,
          forceAlarmManager: true, // Use A
          enableHeadless: true,
        },
        BackgroundFetchTask,
        error => {
          console.log('[BackgroundFetch] failed to start', error);
        },
      );
    }

    // BackgroundFetch.scheduleTask({
    //   taskId: 'com.jobcity.backgroundFetch',
    //   delay: 30000, // milliseconds
    //   periodic: false,
    // });
    // setupBackgroundFetch();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigation />
    </QueryClientProvider>
  );
};
=======
const queryClient = new QueryClient();

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState(-1);
  const [events, setEvents] = useState([]);
  const [isBatteryOptimized, setIsBatteryOptimized] = useState(true);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  //use effect for fcm push notification
  useEffect(() => {
    // Handle background and quit state notifications
    messaging().onNotificationOpenedApp(remoteMessage => {
      const category = remoteMessage.data?.post_category;
      if (category) {
        navigationRef.current?.navigate('Listing', {category});
      }
    });

    // Handle initial notification if app is opened by clicking a notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const category = remoteMessage.data?.post_category;
          if (category) {
            console.log('this is category', category);
            navigationRef.current?.navigate('Listing', {category});
          }
        }
      });
    //handle background and quit state
    const unsubscribeNotificationOpenedApp =
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage,
        );

        // Navigate based on notification data
        const category = remoteMessage.data?.post_category;
        if (category) {
          navigationRef.current?.navigate('Listing', {category});
        }
      });

    // Handle notifications in foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const category = remoteMessage.data?.post_category;
      if (category) {
        navigationRef.current?.navigate('Listing', {category});
      }
    });

    return () => {
      unsubscribe();
      unsubscribeNotificationOpenedApp();
    };
  }, []);

  //useEFFect for notifee search notification
  useEffect(() => {
    // Handle foreground notification clicks
    const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.PRESS) {
        handleNotificationPress(detail.notification.data);
      }
    });

    // Handle background notification clicks
    notifee.onBackgroundEvent(async ({type, detail}) => {
      if (type === EventType.PRESS) {
        handleNotificationPress(detail.notification.data);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNotificationPress = data => {
    // Ensure data contains the screen and other params
    if (data && data.keyWord) {
      navigationRef.current?.navigate('Listing', {
        search: data.keyWord,
      });
    }
  };

  // useEFfect for requestnotification
  React.useEffect(() => {
    requestNotificationPermission();
    initBackgroundFetch();
    if (Platform.OS === 'android') {
      checkBatteryOptimization();
    }
  });

  // useEffect(() => {
  //   // Request permissions for push notifications via fcm
  //   const requestUserPermission = async () => {
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log('Authorization status:', authStatus);
  //     }
  //   };

  //   requestUserPermission();

  //   messaging()
  //     .getToken()
  //     .then(token => {
  //       console.log('FCM Token:', token);
  //       // You can store this token to send targeted notifications later
  //     });

  //   // Handle foreground messages
  //   // const unsubscribe = messaging().onMessage(async remoteMessage => {
  //   //   Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   // });

  //   // Cleanup on unmount
  //   // return unsubscribe;
  // }, []);

  const checkBatteryOptimization = async () => {
    if (Platform.OS !== 'android') return;

    try {
      const packageName = 'com.jobcity'; // Replace with your app's package name
      const intent = await Linking.canOpenURL(`package:${packageName}`);

      if (!intent) {
        setIsBatteryOptimized(false);
        Alert.alert(
          'Battery Optimization',
          'Please disable battery optimization for better app NOtifications.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => openBatteryOptimizationSettings(packageName),
            },
          ],
          {cancelable: false},
        );
      } else {
        setIsBatteryOptimized(true);
      }
    } catch (error) {
      console.error('Battery optimization check failed', error);
    }
  };

  const openBatteryOptimizationSettings = packageName => {
    if (Platform.OS === 'android') {
      Linking.openURL(`package:${packageName}`);
    }
  };

  const initBackgroundFetch = async () => {
    const status = await BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
        stopOnTerminate: false,
        enableHeadless: true,
        startOnBoot: true,
        // Android options
        forceAlarmManager: true, // <-- Set true to bypass JobScheduler.
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Default
        requiresCharging: false, // Default
        requiresDeviceIdle: false, // Default
        requiresBatteryNotLow: false, // Default
        requiresStorageNotLow: false, // Default
      },
      async taskId => {
        console.log('[BackgroundFetch] started taskId', taskId);
        // Create an Event record.
        const event = await Event.create(taskId, false);
        // Update state.
        fetchArticles();
        setEvents(prev => [...prev, event]);
        // Finish.
        BackgroundFetch.finish(taskId);
      },
      taskId => {
        // Oh No!  Our task took too long to complete and the OS has signalled
        // that this task must be finished immediately.
        console.log('[Fetch] TIMEOUT taskId:', taskId);
        BackgroundFetch.finish(taskId);
      },
    );
    setStatus(status);
    setEnabled(true);
  };

  /// Clear the Events list.
  ///

  return (
    <QueryClientProvider client={queryClient}>
      <Text style={styles.message}>
        {isBatteryOptimized
          ? 'Battery optimization is enabled.'
          : 'Battery optimization is disabled for this app.'}
      </Text>
      {!isBatteryOptimized && (
        <Button
          title="Disable Battery Optimization"
          onPress={openBatteryOptimizationSettings}
        />
      )}
      <AppNavigation navigationRef={navigationRef} />
    </QueryClientProvider>
  );
}
>>>>>>> latest

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

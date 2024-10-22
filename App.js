/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {LogLevel, OneSignal} from 'react-native-onesignal';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import Event from './src/Event';
import {firebase} from '@react-native-firebase/app';
import {firebaseConfig} from './src/constants/Channels';

// import type {PropsWithChildren} from 'react';
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
  Switch,
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

  React.useEffect(() => {
    requestNotificationPermission();
    initBackgroundFetch();
    if (Platform.OS === 'android') {
      checkBatteryOptimization();
    }

    //OneSignal.setAppId('Y61d48177-4dd2-44cf-8da4-408e3e0ebb51');
    // Remove this method to stop OneSignal Debugging
  });

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  ///OneSignal.SetLogLevel(OneSignal.LOG_LEVEL.DEBUG, OneSignal.LOG_LEVEL.DEBUG);
  // OneSignal Initialization
  OneSignal.initialize('61d48177-4dd2-44cf-8da4-408e3e0ebb51');

  // Method for listening for notification clicks
  OneSignal.Notifications.addEventListener(
    'click',
    event => {
      console.log('OneSignal: notification clicked:', event);

      // loadEvents();
      // BackgroundFetch.configure(
      //   {
      //     minimumFetchInterval: 15, // Fetch interval in minutes
      //     stopOnTerminate: false,
      //     startOnBoot: true,
      //     requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
      //     requiresCharging: false,
      //     requiresDeviceIdle: false,
      //     requiresBatteryNotLow: false,
      //     requiresStorageNotLow: false,
      //     forceAlarmManager: true, // Use A
      //     enableHeadless: true,
      //   },
      //   BackgroundFetchTask,
      //   error => {
      //     console.log('[BackgroundFetch] failed to start', error);
      //   },
      // );

      //BackgroundFetch.registerHeadlessTask(BackgroundFetchTask);
      // Manually trigger background fetch for testing
      // BackgroundFetch.scheduleTask({
      //     taskId: 'com.jobcity.backgroundFetch',
      //     delay: 5000,  // milliseconds
      //     periodic: false
      // });
      // BackgroundFetch.status(status => {
      //   switch (status) {
      //     case BackgroundFetch.STATUS_RESTRICTED:
      //       console.log('BackgroundFetch restricted');
      //       break;
      //     case BackgroundFetch.STATUS_DENIED:
      //       console.log('BackgroundFetch denied');
      //       break;
      //     case BackgroundFetch.STATUS_AVAILABLE:
      //       console.log('BackgroundFetch is enabled');
      //       break;
      //   }
      // });
    },
    [],
  );

  useEffect(() => {
    // Request permissions for push notifications via fcm
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    };

    requestUserPermission();

    messaging()
      .getToken()
      .then(token => {
        console.log('FCM Token:', token);
        // You can store this token to send targeted notifications later
      });

    // Handle foreground messages
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    // });

    // Cleanup on unmount
    // return unsubscribe;
  }, []);

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
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
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

  /// Load persisted events from AsyncStorage.
  ///
  // const loadEvents = () => {
  //   Event.all()
  //     .then(data => {
  //       setEvents(data);
  //     })
  //     .catch(error => {
  //       Alert.alert('Error', 'Failed to load data from AsyncStorage: ' + error);
  //     });
  // };

  /// Toggle BackgroundFetch ON/OFF
  ///

  /// [Status] button handler.
  ///

  /// [scheduleTask] button handler.
  /// Schedules a custom-task to fire in 5000ms
  ///
  const onClickScheduleTask = () => {
    BackgroundFetch.scheduleTask({
      taskId: 'com.transistorsoft.customtask',
      delay: 5000,
      forceAlarmManager: true,
    })
      .then(() => {
        Alert.alert('scheduleTask', 'Scheduled task with delay: 5000ms');
      })
      .catch(error => {
        Alert.alert('scheduleTask ERROR', error);
      });
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
      <AppNavigation />
    </QueryClientProvider>
  );
}

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

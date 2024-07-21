/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
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

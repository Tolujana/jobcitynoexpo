/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Event from './src/Event';
import type {PropsWithChildren} from 'react';
//import IntentLauncher, {IntentConstant} from 'react-native-intent-launcher'
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

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

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

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [enabled, setEnabled] = React.useState(false);
  const [status, setStatus] = React.useState(-1);
  const [events, setEvents] = React.useState<Event[]>([]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  React.useEffect(() => {
    requestNotificationPermission();
    initBackgroundFetch();
    if (Platform.OS === 'android') {
      checkBatteryOptimization();
    }
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
  }, []);

  const checkBatteryOptimization = async () => {
    try {
      const isIgnoringBatteryOptimizations =
        await IntentLauncher.isIgnoringBatteryOptimizations();

      if (!isIgnoringBatteryOptimizations) {
        Alert.alert(
          'Battery Optimization',
          'Please disable battery optimization for better app nofications.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => openBatteryOptimizationSettings(),
            },
          ],
          {cancelable: false},
        );
      }
    } catch (error) {
      console.error('Battery optimization check failed', error);
    }
  };

  const initBackgroundFetch = async () => {
    const status: number = await BackgroundFetch.configure(
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
      async (taskId: string) => {
        console.log('[BackgroundFetch] started taskId', taskId);
        // Create an Event record.
        const event = await Event.create(taskId, false);
        // Update state.
        fetchArticles();
        setEvents(prev => [...prev, event]);
        // Finish.
        BackgroundFetch.finish(taskId);
      },
      (taskId: string) => {
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
  const openBatteryOptimizationSettings = () => {
    if (Platform.OS === 'android') {
      IntentLauncher.startActivity({
        action: IntentConstant.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS,
      });
    }
  };

  /// [Status] button handler.
  ///
  const onClickStatus = () => {
    BackgroundFetch.status().then((status: number) => {
      let statusConst = '';
      switch (status) {
        case BackgroundFetch.STATUS_AVAILABLE:
          statusConst = 'STATUS_AVAILABLE';
          break;
        case BackgroundFetch.STATUS_DENIED:
          statusConst = 'STATUS_DENIED';
          break;
        case BackgroundFetch.STATUS_RESTRICTED:
          statusConst = 'STATUS_RESTRICTED';
          break;
      }
      Alert.alert('BackgroundFetch.status()', `${statusConst} (${status})`);
    });
  };

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

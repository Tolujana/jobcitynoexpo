/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {createNavigationContainerRef} from '@react-navigation/native';
import notifee, {EventType} from '@notifee/react-native';
import {MD3LightTheme as DefaultTheme, PaperProvider} from 'react-native-paper';
import React, {useEffect, useState, useContext} from 'react';
import messaging from '@react-native-firebase/messaging';
import Event from './src/Event';
import {firebase} from '@react-native-firebase/app';
import {firebaseConfig} from './src/constants/Channels';
import {navigationRef} from './src/navigation/NotificationNavigate';
import ExitApp from 'react-native-exit-app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Rate, {AndroidMarket} from 'react-native-rate';
// import type {PropsWithChildren} from 'react';

import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  Button,
  Alert,
  Linking,
  View,
  Modal,
  TouchableOpacity,
} from 'react-native';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import AppNavigation from './src/navigation';
import BackgroundFetchTask, {
  fetchArticles,
} from './src/components/BackgroundFetchTask';
import BackgroundFetch from 'react-native-background-fetch';
import {ThemeProvider} from './src/theme/themeContext';
import {fetchNewDataFromAPI} from './src/util/funtions';
import {
  SplashContext,
  SplashProvider,
  useSplashContext,
} from './src/context/SplashContext';
//import {SplashContext, SplashProvider} from './src/context/SplashContext';

const RATE_PROMPT_KEY = 'lastRatePrompt';
const USER_RATED_KEY = 'userRated';
const FIVE_DAYS_MS = 20 * 60 * 1000;
// * 24 * 60
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
      // console.log('Notification permission denied');
    }
  }
};

const queryClient = new QueryClient();

function App() {
  const [showModal, setShowModal] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState(-1);
  const [events, setEvents] = useState([]);
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [date, setDate] = useState('');
  //const {isSplashLoaded} = useContext(SplashContext);
  const {isSplashFinished, setIsSplashFinished} = useContext(SplashContext);
  useEffect(() => {
    initBackgroundFetch();
  }, []);

  const checkAndPromptForRating = async () => {
    try {
      const lastPrompt = await AsyncStorage.getItem(RATE_PROMPT_KEY);
      const userRated = await AsyncStorage.getItem(USER_RATED_KEY);

      if (userRated === 'true') return; // User already rated the app.

      const now = Date.now();
      if (!lastPrompt && now - parseInt(lastPrompt, 10) > FIVE_DAYS_MS) {
        setShowModal(true);

        await AsyncStorage.setItem(RATE_PROMPT_KEY, now.toString());
      }
    } catch (error) {
      console.error('Error checking rate prompt:', error);
    }
  };

  const handleRateNow = async () => {
    const options = {
      AppleAppID: 'YOUR_APPLE_APP_ID',
      GooglePackageName: 'com.hotnigerianjobs',
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: true,
      openAppStoreIfInAppFails: true,
    };

    Rate.rate(options, async success => {
      if (success) {
        await AsyncStorage.setItem(USER_RATED_KEY, 'true');
      }
    });

    setShowModal(false);
  };

  const handleLater = () => {
    setShowModal(false);
  };

  useEffect(() => {
    // Handle background and quit state notifications
    messaging().onNotificationOpenedApp(remoteMessage => {
      const category = remoteMessage.data?.post_category;
      if (category) {
        navigationRef.current?.navigate('NewListing', {category});
      }
    });

    // Handle initial notification if app is opened by clicking a notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const category = remoteMessage.data?.post_category;
          if (category) {
            // console.log('this is category', category);
            navigationRef.current?.navigate('NewListing', {category});
          }
        }
      });
    //handle background and quit state
    const unsubscribeNotificationOpenedApp =
      messaging().onNotificationOpenedApp(remoteMessage => {
        const category = remoteMessage.data?.post_category;
        if (category) {
          navigationRef.current?.navigate('NewListing', {category});
        }
      });

    // Handle notifications in foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const {post_category, post_title} = remoteMessage.data;
      if (post_title) {
        Alert.alert(
          `New vacancy in ${post_category}.`,
          `${post_title}.`,
          [
            {
              text: 'Cancel',
              onPress: () => {
                // Do nothing, leaves user on the current page
              },
              style: 'cancel',
            },
            {
              text: 'See Article',
              onPress: () => {
                // Navigate to the target screen, based on the notification data
                navigationRef.current?.navigate('NewListing', {
                  category: post_category,
                });
              },
            },
          ],
          {cancelable: true},
        );
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
      navigationRef.current?.navigate('NewListing', {
        search: data.keyWord,
      });
    }
  };

  // useEFfect for requestnotification
  React.useEffect(() => {
    if (isSplashFinished) {
      requestNotificationPermission();
      checkAndPromptForRating();
    }
  }, [isSplashFinished]);

  useEffect(() => {
    // useEffect to check for updates
    const checkUpdateStatus = async () => {
      try {
        // Fetch update config
        const response = await fetchNewDataFromAPI(
          'https://screammie.info/upgrade.json',
        );
        // console.log('appresponse', response);
        const {updateDeadline, warningPeriod} = response;

        const deadline = new Date(updateDeadline); // Deadline date
        const today = new Date(); // Current date
        setDate(deadline.toLocaleDateString());
        // Calculate warning start date
        const warningStart = new Date(deadline);
        warningStart.setDate(deadline.getDate() - warningPeriod);

        if (today > deadline) {
          setIsUpdateRequired(true);
        } else if (today > warningStart) {
          setIsWarning(true);
        }
      } catch (error) {
        console.error('Error fetching update config:', error);
      }
    };

    checkUpdateStatus();
  }, []);

  useEffect(() => {
    // Request permissions for push notifications via fcm
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        // console.log('Authorization status:', authStatus);
      }
    };

    requestUserPermission();

    console.log('App splash', isSplashFinished);
    messaging()
      .getToken()
      .then(token => {
        // console.log('FCM Token:', token);
        // You can store this token to send targeted notifications later
      });
  }, []);

  const initBackgroundFetch = async () => {
    const status = await BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
        stopOnTerminate: false,
        enableHeadless: true,
        startOnBoot: true,
        // Android options
        //forceAlarmManager: true, // <-- Set true to bypass JobScheduler.
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Default
        requiresCharging: false, // Default
        requiresDeviceIdle: false, // Default
        requiresBatteryNotLow: false, // Default
        requiresStorageNotLow: false, // Default
      },
      async taskId => {
        // console.log('[BackgroundFetch] started taskId', taskId);
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
        // console.log('[Fetch] TIMEOUT taskId:', taskId);
        BackgroundFetch.finish(taskId);
      },
    );
    setStatus(status);
    setEnabled(true);
  };

  if (isUpdateRequired) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          This version is now obsolate. Please update to the latest version.
        </Text>
        <Button
          title="Update Now"
          onPress={() => {
            Alert.alert(
              'Update Required',
              'You will be redirected to the app store to update the app.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    Linking.openURL(
                      'https://play.google.com/store/apps/details?id=com.hotnigerianjobs',
                    )
                      .then(() => {
                        // Close the app after opening the update link
                        ExitApp.exitApp();
                      })
                      .catch(error =>
                        console.error('Error opening app store:', error),
                      );
                  },
                },
              ],
            );
          }}
        />
      </View>
    );
  }

  if (isWarning) {
    Alert.alert(
      'Update Available',
      `A new version of this app will be required soon. Please update before ${date}`,
      [
        {
          text: 'Not Now',
          style: 'cancel', // Allows dismissal of the alert
        },
        {
          text: 'Update Now',
          onPress: () =>
            Linking.openURL(
              'https://play.google.com/store/apps/details?id=com.hotnigerianjobs',
            ),
        },
      ],
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Modal
          transparent
          visible={showModal}
          animationType="slide"
          onRequestClose={() => setShowModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enjoying the App?</Text>
              <Text style={styles.modalText}>
                We’d love to hear your feedback! Would you like to rate us?
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.rateNowButton]}
                  onPress={handleRateNow}>
                  <Text style={styles.buttonText}>Rate Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.laterButton]}
                  onPress={handleLater}>
                  <Text style={styles.buttonText}>Later</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <AppNavigation navigationRef={navigationRef} />
      </ThemeProvider>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  rateNowButton: {
    backgroundColor: '#4CAF50',
  },
  laterButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;

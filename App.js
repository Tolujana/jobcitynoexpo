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
import showErrorAlert from './src/components/ShowErrorAlert';

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
import {fetchNewDataFromAPI, hasRewardPoints} from './src/util/funtions';
import {
  SplashContext,
  SplashProvider,
  useSplashContext,
} from './src/context/SplashContext';
import {RewardProvider} from './src/context/RewardContext';
//import {SplashContext, SplashProvider} from './src/context/SplashContext';

const RATE_PROMPT_KEY = 'lastRatePrompt';
const USER_RATED_KEY = 'userRated';
const FIVE_DAYS_MS = 24 * 60 * 60 * 1000;
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
  const [shouldShow, setShouldShow] = useState(true);
  const [initialRoute, setInitialRoute] = React.useState('SplashScreen');
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
      if (lastPrompt && now - parseInt(lastPrompt, 10) > FIVE_DAYS_MS) {
        setShowModal(true);

        await AsyncStorage.setItem(RATE_PROMPT_KEY, now.toString());
      } else if (!lastPrompt) {
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
    const updateRewardPoints = async () => {
      // Retrieve stored data from AsyncStorage
      const storedPoints = await AsyncStorage.getItem('rewardAmount');
      const storedLastOpened = await AsyncStorage.getItem('lastOpened');

      const currentTime = new Date();
      const currentDay = currentTime.toDateString();

      // If stored last opened exists and is not today's date, increase points
      if (storedLastOpened) {
        const lastOpenedDate = new Date(parseInt(storedLastOpened, 10));
        const lastOpenedDay = lastOpenedDate.toDateString();

        // If last opened was a different day (i.e., a new day)
        if (lastOpenedDay !== currentDay) {
          const newPoints = storedPoints ? parseInt(storedPoints, 10) + 5 : 5;

          // Store updated reward points in AsyncStorage
          await AsyncStorage.setItem('rewardAmount', newPoints.toString());
        }
      } else {
        // If it's the first time opening the app, set the points
        await AsyncStorage.setItem('rewardAmount', '5');
      }

      // Update the 'lastOpened' timestamp to the current time
      await AsyncStorage.setItem(
        'lastOpened',
        currentTime.getTime().toString(),
      );
    };

    updateRewardPoints();
  }, []);

  useEffect(() => {
    // Handle background and quit state notifications
    const checkNotification = async () => {
      const result = await hasRewardPoints(1); // Pass your value here

      setShouldShow(result); // Update state based on the result
    };

    checkNotification();
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (shouldShow) {
        const category = remoteMessage.data?.post_category;
        const post_title = remoteMessage.data?.post_title;
        if (category) {
          navigationRef.current?.navigate('NewListing', {
            category,
            post_title,
            refresh: true,
          });
        }
      } else {
        navigationRef.current?.navigate('ShowError');
        // showErrorAlert();
      }
    });

    // Handle initial notification if app is opened by clicking a notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log('i triggered .getInitialNotification');
        if (shouldShow) {
          if (remoteMessage) {
            const category = remoteMessage.data?.post_category;
            const post_title = remoteMessage.data?.post_title;
            setInitialRoute(remoteMessage.data.screen);
            if (category) {
              // console.log('this is category', category);
              navigationRef.current?.navigate('NewListing', {
                category,
                post_title,
                refresh: true,
              });
            }
          }
        } else {
          navigationRef.current?.navigate('ShowError');
          // showErrorAlert();
        }
      });
    //handle background and quit state
    const unsubscribeNotificationOpenedApp =
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('i triggered onNOtificationOpenedApp');
        const category = remoteMessage.data?.post_category;
        const post_title = remoteMessage.data?.post_title;

        //const result = await checkNotification(1);
        if (shouldShow) {
          if (category) {
            navigationRef.current?.navigate('NewListing', {
              category,
              post_title,
            });
          }
        } else {
          navigationRef.current?.navigate('ShowError');
          //showErrorAlert();
        }
      });

    // Handle notifications in foreground
    const unsubscribe = messaging().onMessage(remoteMessage => {
      const {post_category, post_title} = remoteMessage.data;

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
            onPress: async () => {
              // Navigate to the target screen, based on the notification data

              if (shouldShow) {
                navigationRef.current?.navigate('NewListing', {
                  category: post_category,
                  post_title,
                  refresh: true,
                });
              } else {
                navigationRef.current?.navigate(
                  'ShowError',
                  'to show job article',
                );
              }
            },
          },
        ],
        {cancelable: true},
      );
    });

    return () => {
      unsubscribe();
      unsubscribeNotificationOpenedApp();
    };
  }, []);

  // useEFFect for notifee search notification
  useEffect(() => {
    const checkNotification = async () => {
      const result = await hasRewardPoints(2); // Pass your value here
      setShouldShow(result); // Update state based on the result
    };
    checkNotification();
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      if (shouldShow)
        await notifee.displayNotification({
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          android: {channelId: 'default'},
        });
    });

    // Handle hasRewardPointsound notification clicks
    const unsubscribe = notifee.onForegroundEvent(async ({type, detail}) => {
      const result = await hasRewardPoints(2);

      if (type === EventType.PRESS) {
        if (shouldShow) {
          handleNotificationPress(detail.notification.data);
        } else {
          showErrorAlert();
        }
      }
    });

    // Handle background notification clicks
    notifee.onBackgroundEvent(async ({type, detail}) => {
      if (type === EventType.PRESS) {
        if (shouldShow) {
          handleNotificationPress(detail.notification.data);
        } else {
          showErrorAlert();
        }
      }
    });
    // Handle cold start if notification was tapped
    if (global.pendingScreen) {
      navigationRef.current?.navigate(global.pendingScreen);
      global.pendingScreen = null; // Clear after navigation
    }

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleNotificationClick = async () => {
      // Foreground Click Event (Handled by Notifee)
      const hasPoints = await hasRewardPoints(2);

      // Background Click Event (Handled by Firebase)
      messaging().onNotificationOpenedApp(remoteMessage => {
        if (remoteMessage?.data) {
          if (hasPoints) {
            console.log('notifee onnotificationOpend');
            handleNotificationPress(remoteMessage?.data);
          }
        }
      });

      // Quit-State Click Event (App was closed)
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification?.data) {
        if (hasPoints) {
          handleNotificationPress(initialNotification?.data);
        }
      }
    };
    handleNotificationClick();
  }, []);

  const handleNotificationPress = data => {
    // Ensure data contains the screen and other params
    if (data && data.keyWord) {
      navigationRef.current?.navigate('NewListing', {
        search: data.keyWord,
        post_title: data.post_title,
        refresh: true,
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
        <RewardProvider>
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
          <AppNavigation
            navigationRef={navigationRef}
            initialRoute={initialRoute}
          />
        </RewardProvider>
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

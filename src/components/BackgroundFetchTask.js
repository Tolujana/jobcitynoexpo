import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundFetch from 'react-native-background-fetch';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';

export const fetchArticles = async task => {
  try {
    const apiListJson = await AsyncStorage.getItem('apiList');
    const apiList = JSON.parse(apiListJson) || [];

    for (const keyWord of apiList) {
      const encodeKeyword = encodeURIComponent(keyWord.slug);
      const concatenateUrl = `https://public-api.wordpress.com/rest/v1.2/sites/screammie.info/posts/?search=${encodeKeyword}&number=1`;

      const response = await fetch(concatenateUrl);
      const data = await response.json();
      const latestData = parseDate(data);
      const lastData = await getLastDate(keyWord.search);

      if (latestData !== lastData) {
        await saveLastDate(keyWord.search, latestData);
        sendNotification(keyWord.search, latestData);
      }

      // // console.log('im wroking ', apiName);
      //  await CheckPermissionAndSend(apiName, apiUrl);
      // sendNotification(apiName, apiUrl);
    }
  } catch (error) {
    if (task.cancelled) {
      // console.log('it is cancelled o');
    }
    console.error(error);
  }
};

const parseDate = data => {
  // Implement your date parsing logic
  return data.posts[0].title;
};

const getLastDate = async keyWord => {
  try {
    const lastData = await AsyncStorage.getItem(keyWord);
    return lastData || '';
  } catch (error) {
    console.error(error);
    return '';
  }
};

const saveLastDate = async (keyWord, data) => {
  try {
    await AsyncStorage.setItem(keyWord, data);
  } catch (error) {
    console.error(error);
  }
};

export const backgroundFetchTask = async () => {
  // console.log('[BackgroundFetch] Task started');
  await fetchArticles();

  BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
};

export const sendNotification = async (name, data) => {
  // Create a channel (required for Android)
  //   const authorizationStatus = await notifee.requestPermission({
  //     provisional: true, // Optional for Android 13
  //   });

  // console.log('Notification permission granted');
  const channel = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  await notifee.displayNotification({
    title: ` ${name} - Keyword Notification`,
    body: ` ${data}`,
    android: {
      channelId: channel,
      // smallIcon:'ic_launcher'
      pressAction: {
        id: 'default',
      },
    },

    data: {
      screen: 'NewListing',
      search: name, // Custom data
      post_title: data,
    },
  });
};

const CheckPermissionAndSend = async (name, url) => {
  // console.log('insidenow');
  const settings = await notifee.getNotificationSettings();

  if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
    // console.log('Notification permissions have been denied');
  } else if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
      title: `New Article fromss ${name}`,
      body: ` ${url}`,
      android: {
        channelId: 'default',
        // smallIcon:'ic_launcher'
      },
    });
    // console.log('sent message o');
  } else if (
    settings.authorizationStatus === AuthorizationStatus.NOT_DETERMINED
  ) {
    // console.log('Notification permissions have not been determined');
  }
};

const checkNotificationPermission = async () => {};

const requestNotificationPermission = async () => {
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    // console.log('Notification permissions have been granted');
  } else {
    // console.log('Notification permissions have been denied');
  }
};

export default backgroundFetchTask;

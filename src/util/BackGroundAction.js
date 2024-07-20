import BackgroundActions from 'react-native-background-actions';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const task = async taskDataArguments => {
  const {delay} = taskDataArguments;
  await new Promise(async resolve => {
    for (let i = 0; BackgroundActions.isRunning(); i++) {
      try {
        const jsonValue = await AsyncStorage.getItem('apiList');
        const apiList = jsonValue != null ? JSON.parse(jsonValue) : {};

        const currentDate = new Date();

        const currentDayOfMonth = currentDate.getDate();
        const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
        const currentYear = currentDate.getFullYear();
        const timestamp = formatTime(currentDate);
        const time =
          currentDayOfMonth +
          '-' +
          (currentMonth + 1) +
          '-' +
          currentYear +
          '|' +
          timestamp;

        for (const [name, url] of Object.entries(apiList)) {
          // const response = await fetch(url);
          // const data = await response.json();
          // const latestArticle = data[0]; // Adjust based on API response structure
          // const lastDate = await AsyncStorage.getItem(`lastDate_${name}`);
          // if (lastDate !== latestArticle.date) {
          //   await AsyncStorage.setItem(`lastDate_${name}`, latestArticle.date);
          //   sendNotification(name, url);
          // }
          sendNotification(name, url);
          console.log('we are doing stunt');
          await BackgroundActions.updateNotification({
            taskDesc: `last job found ${time}|
            ${name} `,
          });
        }
      } catch (error) {
        console.error(error);
      }
      await sleep(delay);
      // resolve();
    }
  });
};

const options = {
  taskName: 'BackgroundFetchTask',
  taskTitle: 'Job notifications',
  taskDesc: 'checks jobs every 1hr',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  //   linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 90000, // 1 minute
  },
};

const startTask = async () => {
  await BackgroundActions.start(task, options);
  // Only Android, iOS will ignore this call
};

const stopTask = async () => {
  await BackgroundActions.stop();
};

export const sendNotification = async (name, url) => {
  // Create a channel (required for Android)
  //   const authorizationStatus = await notifee.requestPermission({
  //     provisional: true, // Optional for Android 13
  //   });

  console.log('traying to send notification');
  const channel = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: `New Article from woks ${name}`,
    body: ` done ${url}`,

    android: {
      channelId: channel,
      smallIcon: 'ic_launcher',
      // importance: AndroidImportance.HIGH,
    },
  });
};

// export const sendNotifications = (name, url) => {
//   PushNotification.localNotification({
//     channelId: 'default-channel-id',
//     title: `New Article from ${name}`,
//     message: `Check out the new content at: ${url}`,
//   });
// };

// PushNotification.createChannel(
//   {
//     channelId: 'default-channel-id', // (required)
//     channelName: 'Default Channel', // (required)
//     channelDescription: 'A default channel', // (optional) default: undefined.
//     playSound: false, // (optional) default: true
//     soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
//     importance: 4, // (optional) default: 4. Int value of the Android notification importance
//     vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
//   },
//   created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
// );

function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strMinutes = minutes < 10 ? '0' + minutes : minutes;
  const strSeconds = seconds < 10 ? '0' + seconds : seconds;

  const formattedTime = `${hours}:${strMinutes}:${strSeconds} ${ampm}`;
  return formattedTime;
}
export {startTask, stopTask};

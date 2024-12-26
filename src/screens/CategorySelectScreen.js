import React, {useState, useEffect, useContext} from 'react';
import {View, Text} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {getChannels} from '../constants/Channels';
import SubscribeButton from '../components/SubscribeButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeContext} from '../theme/themeContext';

const STORAGE_KEY = 'subscribedChannels';

const CategorySelectionScreen2 = () => {
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const theme = useContext(ThemeContext);
  const {primary, backgroundCard, text, text2, secondary, background} =
    theme.colors;
  useEffect(() => {
    messaging()
      .getSubscribedTopics()
      .then(topics => {
        setSubscribedChannels(topics);
        storeSubscribedChannels(topics);
      });
    retrieveSubscribedChannels();
  }, []);

  const handleSubscribe = (channelId, isSubscribed) => {
    if (isSubscribed) {
      setSubscribedChannels([...subscribedChannels, channelId]);
    } else {
      setSubscribedChannels(
        subscribedChannels.filter(channel => channel !== channelId),
      );
    }
    storeSubscribedChannels(subscribedChannels);
  };

  const storeSubscribedChannels = async channels => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(channels));
    } catch (error) {
      console.error('Error storing subscribed channels:', error);
    }
  };

  const retrieveSubscribedChannels = async () => {
    try {
      const storedChannels = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedChannels) {
        setSubscribedChannels(JSON.parse(storedChannels));
      }
    } catch (error) {
      console.error('Error retrieving subscribed channels:', error);
    }
  };

  return (
    <View style={{backgroundColor: background}}>
      <Text>Notification Settings</Text>
      {getChannels().map(channel => (
        <SubscribeButton
          key={channel}
          channelId={channel}
          subscribedChannels={subscribedChannels}
          handleSubscribe={handleSubscribe}
        />
      ))}
    </View>
  );
};

export default CategorySelectionScreen2;

import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {getChannels} from '../constants/Channels';
import SubscribeButton from '../components/SubscribeButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'subscribedChannels';

const CategorySelectionScreen2 = () => {
  const [subscribedChannels, setSubscribedChannels] = useState([]);

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
    <View>
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

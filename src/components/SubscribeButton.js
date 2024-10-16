import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {getChannels} from './channels';

const SubscribeButton = ({channelId, subscribedChannels, handleSubscribe}) => {
  const isSubscribed = subscribedChannels.includes(channelId);

  const handlePress = async () => {
    if (isSubscribed) {
      await messaging().unsubscribeFromTopic(channelId);
      handleSubscribe(channelId, false);
    } else {
      await messaging().subscribeToTopic(channelId);
      handleSubscribe(channelId, true);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>
        {isSubscribed
          ? `Unsubscribe from ${channelId}`
          : `Subscribe to ${channelId}`}
      </Text>
    </TouchableOpacity>
  );
};

export default SubscribeButton;

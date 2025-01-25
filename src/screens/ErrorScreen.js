import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';

import {
  AdEventType,
  TestIds,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import {useFocusEffect} from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rewardedAdUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-7993847549836206/6722594982';
const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId, {
  requestNonPersonalizedAdsOnly: false, // Set to true for non-personalized ads
});

const ErrorScreen = ({navigation, route}) => {
  const [rewardAmount, setRewardAmount] = useState(5);
  const [reward, setReward] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const navigateToSettings = () => {
    navigation.navigate('Settings'); // Navigate to the Settings screen
  };
  const fetchReward = async () => {
    try {
      const storedReward = await AsyncStorage.getItem('rewardAmount');
      setRewardAmount(storedReward !== null ? parseInt(storedReward) : 5); // Set to stored value or default to 5
    } catch (error) {
      console.error('Error fetching reward amount:', error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchReward();
    }, []),
  );

  useEffect(() => {
    //rewarded ads

    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );
    const adEventListener = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      async () => {
        setLoaded(false);
        setIsButtonDisabled(true);
        setTimeout(() => {
          setIsButtonDisabled(false);
        }, 6000);

        rewarded.load();
        await fetchReward();
      },
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async reward => {
        setReward(reward.amount);
        saveRewardToAsyncStorage(reward.amount);
      },
    );

    // Start loading the rewarded ad straight away

    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      adEventListener();
    };
  }, []);

  const saveRewardToAsyncStorage = async amount => {
    try {
      const existingReward = await AsyncStorage.getItem('rewardAmount');
      const totalReward = (parseInt(existingReward) || 0) + amount;
      await AsyncStorage.setItem('rewardAmount', totalReward.toString());
      Alert.alert('Congratulations!', `You earned ${amount} reward points.`);
    } catch (error) {
      console.error('Error saving reward:', error);
    }
  };

  const showAd = () => {
    if (loaded) {
      rewarded.show();
    } else {
      rewarded.load();
      Alert.alert('Ad not ready', 'Please try again later.');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        You do not have enough reward points {route.params}
      </Text>
      <Text style={styles.message}>
        Please go to the settings page for more information.
      </Text>
      <TouchableOpacity style={styles.button} onPress={navigateToSettings}>
        <Text style={styles.buttonText}>Go to Settings</Text>
      </TouchableOpacity>
      <CustomButton
        disable={isButtonDisabled}
        buttonText={`Earn Points`}
        onpress={showAd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorScreen;

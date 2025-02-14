import React, {useEffect, useState, useCallback, useContext} from 'react';
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
import {
  loadRewardedAd,
  loadRewardedIntAd,
  rewarded,
} from '../util/RewardedAdInstance';
import {RewardContext} from '../context/RewardContext';
import {saveRewardToAsyncStorage} from '../util/funtions';

const ErrorScreen = ({navigation, route}) => {
  const [rewardAmount, setRewardAmount] = useState(null);
  const [reward, setReward] = useState(0);
  const [adClosed, setAdClosed] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const {rewardPoints, setRewardPoints} = useContext(RewardContext);
  const navigateToSettings = () => {
    navigation.navigate('Settings'); // Navigate to the Settings screen
  };
  const fetchReward = async () => {
    try {
      const storedReward = await AsyncStorage.getItem('rewardAmount');
      setRewardAmount(storedReward !== null ? parseInt(storedReward) : 15); // Set to stored value or default to 5
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

    const adEventListener = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      async () => {
        setAdClosed(true);
        setIsButtonDisabled(true);
        setTimeout(() => {
          setIsButtonDisabled(false);
        }, 5000);
        loadRewardedAd();

        await fetchReward();
      },
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      rewards => {
        setReward(rewards.amount);
        setRewardPoints(rewards.amount);

        saveRewardToAsyncStorage(rewards.amount);
      },
    );

    // Start loading the rewarded ad straight away

    loadRewardedAd();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeEarned();
      adEventListener();
    };
  }, []);

  useEffect(() => {
    if (adClosed && reward > 0) {
      Alert.alert('Congratulations!', `You earned ${reward} reward points.`);
      setTimeout(() => {
        setReward(0); // Reset AFTER alert
        setAdClosed(false);
      }, 500); // Small delay for UI update stability
    }
  }, [reward, adClosed]);

  const saveFakeRewardToAsyncStorage = async amount => {
    try {
      const existingReward = await AsyncStorage.getItem('rewardAmount');
      const totalReward = (parseInt(existingReward) || 0) + amount;
      await AsyncStorage.setItem('rewardAmount', totalReward.toString());
    } catch (error) {
      console.error('Error saving reward:', error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      // Check if `rewardedLoaded` parameter has changed

      loadRewardedAd();
    }, []),
  );
  const showAd = () => {
    if (rewarded.loaded) {
      rewarded.show();
      loadRewardedAd();
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
      {!__DEV__ ? (
        <CustomButton
          disable={isButtonDisabled}
          buttonText={isButtonDisabled ? 'wait....' : `Earn Points`}
          onpress={showAd}
        />
      ) : (
        <CustomButton
          disable={isButtonDisabled}
          buttonText={isButtonDisabled ? 'wait,,,' : `testing Points`}
          onpress={() => saveFakeRewardToAsyncStorage(10)}
        />
      )}

      {rewardPoints > 0 && (
        <CustomButton
          buttonText={'Close'}
          onpress={() => {
            navigation.goBack();
            setRewardPoints(0);
          }}
        />
      )}
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

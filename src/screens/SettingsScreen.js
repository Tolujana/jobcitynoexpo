import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ThemeContext} from '../theme/themeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AdEventType,
  TestIds,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import {
  loadRewardedAd,
  loadRewardedIntAd,
  rewarded,
} from '../util/RewardedAdInstance';
import {RewardContext} from '../context/RewardContext';
import SendNotification from './SendNotification';
import {saveRewardToAsyncStorage} from '../util/funtions';

export default function SettingsScreen() {
  const [adClosed, setAdClosed] = useState(false);
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const {primary, background, text, text2, secondary, tertiary} = theme.colors;
  const [rewardAmount, setRewardAmount] = useState(null);
  const [reward, setReward] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const openPolicy = async () => {
    const url = 'https://screammie.info/privacy-policy/';
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };
  const fetchReward = async () => {
    try {
      const storedReward = await AsyncStorage.getItem('rewardAmount');
      setRewardAmount(storedReward !== null ? parseInt(storedReward) : 15); // Set to stored value or default to 5
    } catch (error) {
      //console.error('Error fetching reward amount:', error);
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
      unsubscribeEarned();
      adEventListener();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Check if `rewardedLoaded` parameter has changed
      loadRewardedAd();
    }, []),
  );

  useEffect(() => {
    if (adClosed && reward > 0) {
      Alert.alert('Congratulations!', `You earned ${reward} reward points.`);
      setTimeout(() => {
        setReward(0); // Reset AFTER alert
        setAdClosed(false);
      }, 300); // Small delay for UI update stability
    }
  }, [reward, adClosed]);
  const showAd = () => {
    if (rewarded.loaded) {
      rewarded.show();
    } else {
      rewarded.load();
      Alert.alert('Ad not ready', 'Please try again later.');
    }
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: background, color: text}]}>
      {/* Account Settings Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, {color: primary}]}>
          Notification Settings
        </Text>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('Categories')}>
          <Icon name="briefcase-outline" size={24} style={styles.icon} />
          <Text style={styles.text}>Select Job Specialization</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('Form')}>
          <Icon name="create-outline" size={24} style={styles.icon} />
          <Text style={styles.text}>Keyword Notification</Text>
        </TouchableOpacity>
      </View>
      {/* General Settings Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, {color: primary}]}>General</Text>

        <TouchableOpacity style={styles.item} onPress={openPolicy}>
          <Icon name="lock-closed-outline" size={24} style={styles.icon} />
          <Text style={styles.text}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => alert('Terms of Service')}>
          <Icon name="document-text-outline" size={24} style={styles.icon} />
          <Text style={styles.text}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            Alert.alert(
              'About JObcity',
              `
      Jobcity is a mobile app designed to bring you quick update about Jobs you are interested in.

      Version: 1.2
      Developed by: Screammie Tech
      Copyright: Screammie @ 2024. All rights reserved.

      We hope you enjoy using Jobcity! If you have any questions or feedback, please don't hesitate to contact us.
      `,
              [
                {
                  text: 'OK',
                },
              ],
            );
          }}>
          <Icon
            name="information-circle-outline"
            size={24}
            style={styles.icon}
          />
          <Text style={styles.text}>About</Text>
        </TouchableOpacity>
      </View>
      {/* reward session */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, {color: primary}]}>Points</Text>
        <Text>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: tertiary}}>
            Current Reward:
          </Text>{' '}
          You have <Text style={styles.bold}>{rewardAmount}</Text> reward points{' '}
          {'\n'}
          The points are used for the functionality of the App like
          notifications, Jobs saving etc.{'\n'}
        </Text>
        <TouchableOpacity
          style={[styles.addButton, {backgroundColor: primary, color: text2}]}
          onPress={() => navigation.navigate('RewardPoints')}>
          <Text style={[styles.addButtonText, {color: text2}]}>
            Cilck to learn more.
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.addButton2,
            {
              backgroundColor: isButtonDisabled ? tertiary : primary,
              color: text2,
            },
          ]}
          disabled={isButtonDisabled}
          onPress={showAd}>
          <Text style={[styles.addButtonText, {color: text2}]}>
            {isButtonDisabled ? 'Please wait' : 'Earn Points'}
          </Text>
        </TouchableOpacity>
        {/* <SendNotification /> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  section: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  icon: {
    //color: '#555',
    marginRight: 15,
  },
  text: {
    fontSize: 16,
    //color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  addButton: {
    padding: 15,
    borderRadius: 10,
    border: 1,
  },
  addButton2: {
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  addButtonText: {
    textAlign: 'center',
    alignItems: 'center',
    fontSize: 16,
  },
});

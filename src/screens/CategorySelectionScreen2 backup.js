import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {SpecializationList} from '../constants/categories';

const topics = SpecializationList;
const CategorySelectionScreen2 = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);

  // Load previously selected topics from AsyncStorage when the component mounts
  useEffect(() => {
    const loadSelectedTopics = async () => {
      try {
        const storedTopics = await AsyncStorage.getItem('userTopics');
        if (storedTopics) {
          setSelectedTopics(JSON.parse(storedTopics));
        }
      } catch (error) {
        console.error('Failed to load topics:', error);
      }
    };
    loadSelectedTopics();
  }, []);

  // Save selected topics to AsyncStorage whenever they change
  useEffect(() => {
    const saveSelectedTopics = async () => {
      try {
        await AsyncStorage.setItem(
          'userTopics',
          JSON.stringify(selectedTopics),
        );
      } catch (error) {
        console.error('Failed to save topics:', error);
      }
    };
    saveSelectedTopics();
  }, [selectedTopics]);

  // Handle topic subscription/unsubscription
  const handleTopicToggle = async topic => {
    let updatedTopics = [];
    if (selectedTopics.includes(topic)) {
      // Unsubscribe from topic if already selected
      await messaging().unsubscribeFromTopic(topic);
      updatedTopics = selectedTopics.filter(t => t !== topic);
    } else {
      // Subscribe to topic if not already selected
      await messaging().subscribeToTopic(topic);
      updatedTopics = [...selectedTopics, topic];
    }
    setSelectedTopics(updatedTopics);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select Topics to Subscribe</Text>
      {topics.map((topic, index) => (
        <View key={index} style={styles.topicContainer}>
          <TouchableOpacity onPress={() => handleTopicToggle(topic)}>
            <View style={styles.checkbox}>
              {selectedTopics.includes(topic) && (
                <View style={styles.checked} />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.topicText}>{topic}</Text>
        </View>
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  topicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    width: 16,
    height: 16,
    backgroundColor: '#000',
  },
  topicText: {
    fontSize: 16,
  },
});

export default CategorySelectionScreen2;

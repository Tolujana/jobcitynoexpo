import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {NewSpec, SpecializationList} from '../constants/categories';
import CheckBox from '@react-native-community/checkbox';
import {
  checkAndFetchData,
  loadSelectedspecialization,
  loadSelectedTopics,
} from '../util/funtions';

const CategorySelectionScreen2 = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);

  const [data, setData] = useState(NewSpec);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const fetchedData = await checkAndFetchData();

    setData(fetchedData);
    setLoading(false);
  };

  // Load previously selected topics from AsyncStorage when the component mounts
  useEffect(() => {
    loadData();
    loadSelectedspecialization(setSelectedTopics);
  }, []);

  // Save selected topics to AsyncStorage whenever they change
  const saveSelectedTopics = async () => {
    try {
      await AsyncStorage.setItem(
        'userTopics',
        JSON.stringify(selectedTopics),
      ).then(() => {
        Alert.alert('Success', 'Preference saved successfully');
      });
    } catch (error) {
      console.error('Failed to save topics:', error);
    }
  };

  // useEffect(() => {
  //   saveSelectedTopics();
  // }, [selectedTopics]);

  //exclude categories list
  const excludedNames = [
    'Uncategorized',
    'Joblist',
    'Jobberman',
    'Hotnigerianjobs',
    'Jobgurus',
    'Myjobmag',
  ];

  // Handle topic subscription/unsubscription
  const handleTopicToggle = async topic => {
    const {name, slug} = topic;
    let updatedTopics = [];
    if (selectedTopics.some(t => t.slug === topic.slug)) {
      // Unsubscribe from topic if already selected
      await messaging().unsubscribeFromTopic(slug);
      updatedTopics = selectedTopics.filter(t => t.slug !== topic.slug);
    } else {
      // Subscribe to topic if not already selected
      await messaging().subscribeToTopic(slug);
      updatedTopics = [...selectedTopics, topic];
    }
    setSelectedTopics(updatedTopics);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Select Topics to Subscribe</Text>
        {data
          .filter(topic => !excludedNames.includes(topic.name))
          .map((topic, index) => (
            <View key={index} style={styles.topicContainer}>
              <TouchableOpacity onPress={() => handleTopicToggle(topic)}>
                {/* <View style={styles.checkbox}>
              {selectedTopics.includes(topic) && (
                <View style={styles.checked} />
              )}
            </View> */}

                <CheckBox
                  tintColors={{true: '#2563eb'}}
                  value={
                    selectedTopics.some(t => t.slug === topic.slug) || false
                  }
                  onValueChange={() => handleTopicToggle(topic)}
                />
              </TouchableOpacity>
              <Text style={styles.topicText}>{topic.name}</Text>
            </View>
          ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.button}
        onPress={saveSelectedTopics}
        activeOpacity={0.8}>
        <Text style={styles.buttonText}>Save Preferences</Text>
      </TouchableOpacity>
    </>
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
  button: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CategorySelectionScreen2;

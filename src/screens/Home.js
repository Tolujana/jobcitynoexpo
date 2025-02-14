import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import React, {useContext, useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
//mport { StatusBar } from "expo-status-bar";
import {useColorScheme} from 'nativewind';
//import {FontAwesome} from '@expo/vector-icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import CategoriesCard from '../components/CategoriesCard';
import {SpecializationList} from '../constants/categories';
import useCustomFetch from '../util/CustomFetch';
import JobListing from './JobListing';
import Listing from './Listing';
import {AppContext} from '../context/AppContext';
import NewListing from './NewListing';
import Icon from 'react-native-vector-icons/FontAwesome';
import ApiUrlManager from '../components/ApiUrlManager';
import {loadSelectedspecialization, loadSelectedTopics} from '../util/funtions';
import SearchBox from '../components/SearchBox';
import HomeSearchButton from '../components/HomeSearchButton';
import {ThemeContext} from '../theme/themeContext';
import Loader from '../components/Loader';
import CustomModal from '../components/CustomModal';

export default function Home({route}) {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const {primary, background, text, text2, secondry, tertiary} = theme.colors;
  const [modalVisible, setModalVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [jobEntries, setJobEntries] = useState([]);
  const {colorScheme, toggleColorScheme} = useColorScheme();
  const [key, setKey] = useState(0);
  const [specialization, setspecilization] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [sortedkeywords, setSortedKeywords] = useState([]);
  const [sortedSpec, setsortedSpec] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [fullList, setFullList] = useState([]);
  const handleCategoryChange = category => {
    setActiveCategory(category);
  };

  useEffect(() => {
    if (route.params.category) {
      const {category} = route.params.category;
      navigation.replace('NewListing', route.params.category); // Navigate to HomeScreen
      // Prevent the default back behavior
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'This app needs access to send you notifications.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('Notification permission denied');
      }
    }
  };
  React.useEffect(() => {
    requestNotificationPermission();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setIsloading(true);
      loadSelectedspecialization(setspecilization);
      loadSelectedspecialization(setKeywords, 'apiList');
      setIsloading(false);
    }, []),
  );

  useEffect(() => {
    setsortedSpec(specialization.sort((a, b) => a.name.localeCompare(b.name)));
  }, [specialization]);
  useEffect(() => {
    setSortedKeywords(keywords.sort((a, b) => a.search.localeCompare(b.name)));
  }, [keywords]);

  const textInputRef = useRef(null);

  const dismissKeyboard = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
    if (textInputRef.current) {
      textInputRef.current.blur(); // Blur the TextInput in the child
    }
  };
  const addMenuItems = () => {
    Alert.alert('Choose Menu type', '', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Add Job Specialization',
        onPress: () => navigation.navigate('Categories'),
      },
      {
        text: 'Add Custom keywords',
        onPress: () => navigation.navigate('Form'),
      },
    ]);
  };

  const fullMenu = [...sortedSpec, ...sortedkeywords];
  return isLoading ? (
    <View>
      <Loader />
    </View>
  ) : (
    <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
      <SafeAreaView
        style={{backgroundColor: background}}
        className="pt-8 flex-1">
        <StatusBar backgroundColor={primary} />
        {/* header */}
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
        <View className="px-4 justify-between">
          <View className="flex-row justify-between">
            <Text style={{color: primary}} className=" text-3xl font-bold">
              Jobcity
            </Text>
            <HomeSearchButton ref={textInputRef} />
          </View>
          <Text style={{color: text}} className="text-base">
            Jobs from multiple sources
          </Text>
        </View>

        {/* search */}

        {/* categories */}
        <View className=" flex-row my-4 ml-2">
          {/* plus button  */}
          {fullMenu.length > 0 && (
            <TouchableOpacity
              style={{...styles.button, backgroundColor: tertiary}}
              onPress={() => setModalVisible(true)}>
              <Icon name="plus" size={24} color={text2} />
            </TouchableOpacity>
          )}
          {fullMenu.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="space-x-4"
              contentContainerStyle={{paddingRight: 20}}>
              {/* category */}
              {fullMenu.map((category, index) => {
                return (
                  <CategoriesCard
                    category={category}
                    index={index}
                    key={index}
                    activeCategory={
                      activeCategory || sortedSpec[0] || sortedkeywords[0]
                    }
                    onPress={() => handleCategoryChange(category)}
                  />
                );
              })}
            </ScrollView>
          ) : (
            <TouchableOpacity
              style={{...styles.buttonlong, backgroundColor: tertiary}}
              onPress={() => setModalVisible(true)}>
              <View className=" flex-row">
                <Icon name="plus" size={24} color={text2} />
                <Text style={{color: text2}}>Click here to add menu items</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {/* jobLists */}

        <View>
          {!activeCategory ? (
            <NewListing category={sortedSpec[0] || {name: 'All ', slug: ''}} />
          ) : activeCategory.name ? (
            <NewListing category={activeCategory} />
          ) : (
            <NewListing search={activeCategory} />
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonlong: {
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  text: {
    color: 'white',
    marginHorizontal: 10,
  },
});

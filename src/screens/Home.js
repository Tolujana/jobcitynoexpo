import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
//mport { StatusBar } from "expo-status-bar";
import {useColorScheme} from 'nativewind';
//import {FontAwesome} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import CategoriesCard from '../components/CategoriesCard';
import {SpecializationList} from '../constants/categories';
import useCustomFetch from '../util/Functions';
import JobListing from './JobListing';
import Listing from './Listing';
import {AppContext} from '../context/AppContext';
import NewListing from './NewListing';
import Icon from 'react-native-vector-icons/FontAwesome';
import ApiUrlManager from '../components/ApiUrlManager';

export default function Home() {
  const navigation = useNavigation();

  const [activeCategory, setActiveCategory] = useState(0);
  const [jobEntries, setJobEntries] = useState([]);
  const {colorScheme, toggleColorScheme} = useColorScheme();
  const [key, setKey] = useState(0);

  const handleCategoryChange = id => {
    setActiveCategory(id);
    // const url = `http://public-api.wordpress.com/rest/v1.2/sites/en.blog.wordpress.com/posts/?category=${specilization[id]}`;
    // const params = { page: 1, number: 7 };
    // console.log(url);
    // fetchData(url, params);
    // console.log(specilization[id].title, "home things");
  };

  useEffect(() => {}, []);

  return (
    <SafeAreaView className="pt-8 flex-1 bg-white dark:bg-neutral-900">
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {/* header */}
      <View className="px-4 mb-6 justify-between">
        <Text className="text-3xl font-bold text-blue-600 dark:text-white">
          Jobcity
        </Text>

        <Text className="text-base text-gray-700 dark:text-neutral-300">
          Jobs from multiple sources
        </Text>
      </View>

      {/* searc */}

      <View className="mx-4 mb -8 flex-row p-2 py-3 justify-start items-center  bg-neutral-100 dark:bg-neutral-800 rounded-full">
        <TouchableOpacity className="pl-2">
          <Icon name="search" size={25} color="gray" />
        </TouchableOpacity>
        <TextInput
          className="pl-3 flex-1 font-medium tracking-wider"
          placeholder="Search jobs"
          placeholderTextColor={'gray'}
          onPress={() => navigation.navigate('Search Jobs')}
        />
      </View>

      {/* categories */}
      <View className=" flex-row my-4 ml-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="space-x-4"
          contentContainerStyle={{paddingRight: 20}}>
          {SpecializationList.map((category, index) => {
            return (
              <CategoriesCard
                category={category}
                index={index}
                key={index}
                activeCategory={activeCategory}
                onPress={() => handleCategoryChange(index)}
              />
            );
          })}
        </ScrollView>
      </View>
      {/* jobLists */}
      <View>
        <NewListing category={SpecializationList[activeCategory]} />
      </View>
    </SafeAreaView>
  );
}

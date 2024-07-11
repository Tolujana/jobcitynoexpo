import {View, Text, TouchableOpacity, FlatList, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
//import { StatusBar } from "expo-status-bar";
import {useColorScheme} from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderItem from '../components/RenderItem';
import {useFocusEffect} from '@react-navigation/native';

export default function SaveScreen() {
  const {colorScheme} = useColorScheme;
  const [savedArticles, setSavedArticles] = useState({});
  const [articles, setArticles] = useState([]);
  const [bookmarkNumber, setBookmarkNumber] = useState(0);

  const getSavedArticle = async () => {
    try {
      const savedArticleJSON = await AsyncStorage.getItem('savedArticles');
      if (savedArticleJSON !== null) {
        return JSON.parse(savedArticleJSON);
      }
    } catch (error) {
      console.log('Error retrieving saved article:', error);
    }
  };

  const fetchSavedArticle = async () => {
    const articles = await getSavedArticle();
    setSavedArticles(articles);
    setArticles(Object.values(articles));
    setBookmarkNumber(Object.keys(articles).length);
  };

  // useEffect(() => {
  //   fetchSavedArticle();
  // }, []);

  useEffect(() => {
    fetchSavedArticle();
  }, [bookmarkNumber]);

  useFocusEffect(
    React.useCallback(() => {
      fetchSavedArticle();
    }, []),
  );

  const updateBookmark = number => {
    setBookmarkNumber(number);
  };
  const clearItem = async key => {
    try {
      await AsyncStorage.removeItem(key);
      setSavedArticles({});
      setArticles([]);
      console.log(`Item with key ${key} removed`);
    } catch (e) {
      console.error('Failed to remove item from AsyncStorage', e);
    }
  };

  const renderfunction = ({item, index}) => (
    <RenderItem
      item={item}
      index={index}
      savedArticles={savedArticles}
      updateBookmarkNumber={updateBookmark}
    />
  );
  console.log(savedArticles, 'articles');
  return (
    <SafeAreaView className="p-4 bg-white flex-1 dark:bg-neutral-900">
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {/* header */}
      <View className="flex-row justify-between items-center">
        <Text className="text-3xl font-bold text-blue-600 dark:text-white">
          Saved Jobs
        </Text>
        <TouchableOpacity className="bg-blue-600 py-1 px-4 rounded-full text-white">
          <Text
            onPress={() => {
              clearItem('savedArticles');
            }}>
            Clear
          </Text>
        </TouchableOpacity>
      </View>
      {savedArticles && (
        <FlatList
          data={articles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderfunction}
          // Trigger onEndReached when the scroll position is within 50% of the bottom
        />
      )}
    </SafeAreaView>
  );
}

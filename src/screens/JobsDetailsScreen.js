import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import {ChevronLeftIcon, ShareIcon} from 'react-native-heroicons/outline';
import {BookmarkSquareIcon} from 'react-native-heroicons/solid';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useWindowDimensions} from 'react-native';
import ParallaxView from '../components/ParallaxView';

// const {height, width} = Dimensions.get('window');
const AppContent = () => (
  <View>
    <Text style={styles.title}>Parallax Effect</Text>
    <Text style={styles.content}>
      This is some foreground content that scrolls over the background image.
    </Text>
    {/* Add more content here if needed */}
  </View>
);
export default function JobDetailsScreen({route}) {
  const {width, height} = useWindowDimensions();
  //const route = useRoute();
  const {item} = route.params;
  console.log('detials', item.URL);
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [isBookmarked, toggleBookmark] = useState(false);

  // console.log("item URL", item.url);

  const toggleBookmarkAndSave = async () => {
    try {
      // Check if News Article is already in Storage
      const savedArticles = await AsyncStorage.getItem('savedArticles');
      let existingArticle = savedArticles ? JSON.parse(savedArticles) : {};
      // console.log("Check if the article is already bookmarked");

      // Check if the article is already in the bookmarked list
      const isArticleBookmarked = existingArticle[item.ID];
      // console.log("Check if the article is already in the bookmarked list");

      if (!isArticleBookmarked) {
        // If the article is not bookmarked, add it to the bookmarked list
        existingArticle[item.ID] = item;

        await AsyncStorage.setItem(
          'savedArticles',
          JSON.stringify(existingArticle),
        );
        toggleBookmark(true);
        // console.log("Article is bookmarked");
      } else {
        // If the article is already bookmarked, remove it from the list

        delete existingArticle[item.ID];
        await AsyncStorage.setItem(
          'savedArticles',
          JSON.stringify(existingArticle),
        );
        toggleBookmark(false);
        // console.log("Article is removed from bookmarks");
      }
    } catch (error) {
      console.log('Error Saving Article', error);
    }
  };

  useEffect(() => {
    // Load saved articles from AsyncStorage when the component mounts
    const loadSavedArticles = async () => {
      try {
        const savedArticles = await AsyncStorage.getItem('savedArticles');
        const existingArticle = savedArticles ? JSON.parse(savedArticles) : {};

        // Check if the article is already in the bookmarked list
        const isArticleBookmarked = existingArticle[item.ID];

        toggleBookmark(isArticleBookmarked);
        // console.log("Check if the current article is in bookmarks");
      } catch (error) {
        console.log('Error Loading Saved Articles', error);
      }
    };

    loadSavedArticles();
  }, [item]);

  return (
    <>
      <ParallaxView
        image={item.featured_image}
        mainContent={item.content}
        content={
          <View>
            <View className="w-full flex-row justify-between item-center pt-2  pb-4 ">
              <View className="bg-gray-100 p-2 rounded-full item-center justify-center">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <ChevronLeftIcon size={25} strokeWidth={3} color="gray" />
                </TouchableOpacity>
              </View>

              <View className="space-x-3 rounded-full item-center justify-center flex-row">
                <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
                  <ShareIcon size={25} color="gray" strokeWidth={2} />
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-gray-100 p-2 rounded-full"
                  onPress={toggleBookmarkAndSave}>
                  <BookmarkSquareIcon
                    size={25}
                    color={isBookmarked ? 'green' : 'gray'}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        }
      />

      {/* WebView */}
      {/* <WebView
        source={{uri: item.URL}}
        onLoadStart={() => setVisible(true)}
        onLoadEnd={() => setVisible(false)}
      /> */}

      {visible && (
        <ActivityIndicator
          size={'large'}
          color={'green'}
          style={{
            position: 'absolute',
            top: height / 2,
            left: width / 2,
          }}
        />
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

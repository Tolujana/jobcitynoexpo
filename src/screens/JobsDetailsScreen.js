import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StyleSheet,
  Alert,
  BackHandler,
} from 'react-native';

import MobileAds, {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

import React, {useContext, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import {ChevronLeftIcon, ShareIcon} from 'react-native-heroicons/outline';
import {BookmarkSquareIcon} from 'react-native-heroicons/solid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRingerMode, RINGER_MODE} from 'react-native-ringer-mode';

import {useWindowDimensions} from 'react-native';
import ParallaxView from '../components/ParallaxView';
import {MobileAd} from 'react-native-google-mobile-ads/lib/typescript/ads/MobileAd';
import {ThemeContext} from '../theme/themeContext';

// const {height, width} = Dimensions.get('window');

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-7993847549836206/6994945775';

const interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: false,
  videoOptions: {
    startMuted: true, // This mutes the video ads
  },
});

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
  const theme = useContext(ThemeContext);
  const {primary, background, text, text2, secondry, tertiary} = theme.colors;
  const {width, height} = useWindowDimensions();
  const {mode, error, setMode} = useRingerMode();
  const {item} = route.params;
  console.log('detials', item.URL);
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [isBookmarked, toggleBookmark] = useState(false);
  const [backButtonClickCount, setBackButtonClickCount] = useState(0);

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

  useEffect(() => {
    const loadAd = () => {
      interstitialAd.load();
    };

    const adEventListener = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log('Interstitial Ad loaded');
      },
    );

    const adCloseListener = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        // VolumeManager.setVolume(currentVolume);
        navigation.goBack();
        loadAd(); // Reload the ad after it's closed
      },
    );

    // Load the ad initially
    loadAd();

    // Clean up listeners on unmount
    return () => {
      adEventListener(); // Remove the event listener
      adCloseListener();
    };
  }, []);

  // Show the interstitial ad if loaded
  const showInterstitialAd = async () => {
    setBackButtonClickCount(backButtonClickCount + 1);

    // Show ad on alternate back button clicks (e.g., 2nd, 4th, 6th, etc.)
    if (backButtonClickCount % 3 === 0 && interstitialAd.loaded) {
      // Store current volume
      // const currentVolume = await VolumeManager.getVolume();

      // Set volume to 0 (mute)
      // VolumeManager.setVolume(0);

      interstitialAd.show();
    } else {
      navigation.goBack();
    }
  };

  // Handle back press to show the interstitial ad
  useEffect(() => {
    const backAction = () => {
      showInterstitialAd();

      return true; // prevents default back action
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <>
      <ParallaxView
        image={item.featured_image}
        tags={item.tags}
        id={item.ID}
        mainContent={item.content}
        content={
          <View>
            <View className="w-full flex-row justify-between item-center pt-2  pb-4 ">
              <View
                className="p-2 rounded-full item-center justify-center"
                style={{backgroundColor: background}}>
                <TouchableOpacity onPress={() => showInterstitialAd()}>
                  <ChevronLeftIcon size={25} strokeWidth={3} color="gray" />
                </TouchableOpacity>
              </View>

              <View className="space-x-3 rounded-full item-center justify-center flex-row">
                <TouchableOpacity
                  className=" p-2 rounded-full"
                  style={{backgroundColor: background}}>
                  <ShareIcon size={25} color="gray" strokeWidth={2} />
                </TouchableOpacity>
                <TouchableOpacity
                  className=" p-2 rounded-full"
                  style={{backgroundColor: background}}
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

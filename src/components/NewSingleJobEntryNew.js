import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
} from 'react-native';
import React, {memo, useContext, useEffect, useRef, useState} from 'react';
import {styles} from '../../assets/Styles';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
//import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeContext} from '../theme/themeContext';
import {hasRewardPoints} from '../util/funtions';

function NewSingleJobEntry({
  item = {},
  notificationTitle,
  index = 1,
  savedArticles = [],
  adCount,
  incrementCount,
  isRewardLoaded,
  isIntRewardLoaded,
}) {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const {primary, backgroundCard, text, text2, secondary, tertiary} =
    theme.colors;
  const fullSpeciliazation = Object.keys(item?.categories);
  const fulltags = Object.keys(item?.tags);
  const [jobs, ...specialization] = fullSpeciliazation;
  const specs = specialization.join(', ');
  const [savedArticleStatus, setSavedArticleStatus] = useState([]);
  const [idList, setIDlist] = useState([]);
  const [isduplicate, setIsDuplicate] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current;
  const isFlickering = item.title === notificationTitle;
  //console.log('isflicker', isFlickering, 'noti:', notificationTitle);
  const startFlickerAnimation = () => {
    animationValue.setValue(0); // Reset the value to its initial state

    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false, // Set to true if not animating styles that require layout updates
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]),
      {iterations: 12}, // Number of times to repeat the animation
    ).start();
  };

  useEffect(() => {
    // Start flicker animation for the specific article
    startFlickerAnimation();
  }, [notificationTitle]);

  const openItem = () => {
    incrementCount();
    navigation.navigate('JobsDetails', {
      adCount: adCount,
      item: item,
      isRewardLoaded: isRewardLoaded,
      isIntRewardLoaded: isIntRewardLoaded,
    });
  };

  function formatDate(isoDate) {
    const date = new Date(isoDate);

    // Specify options for formatting
    const options = {
      weekday: 'short', // Short weekday name (e.g., "Mon")
      year: 'numeric', // Full numeric year (e.g., "2024")
      month: 'short', // Short month name (e.g., "May")
      day: 'numeric', // Numeric day of the month (e.g., "26")
    };

    // Convert the Date object to a string using the local time zone and specified options
    return date.toLocaleDateString(undefined, options);
  }

  useFocusEffect(
    React.useCallback(() => {
      const clearAsyncStorage = async () => {
        try {
          await AsyncStorage.clear();
          // console.log('AsyncStorage successfully cleared');
        } catch (error) {
          console.error('Error clearing AsyncStorage:', error);
        }
      };
      const updateArticleId = (item, itemIndex) => {
        const article = savedArticles && savedArticles[item?.ID];
        if (article) {
          const updatedStatus = [...savedArticleStatus];
          updatedStatus[item.ID] = true;
          setSavedArticleStatus(updatedStatus);
        }
      };

      // Call the function where appropriate in your app
      //clearAsyncStorage();
      setIsDuplicate(fulltags.includes('duplicate'));
      updateArticleId(item, index);
    }, []),
  );

  const toggleArticleId = async (item, itemIndex) => {
    try {
      // Get existing array of article IDs from AsyncStorage
      const existingArticleIdsString = await AsyncStorage.getItem(
        'savedArticles',
      );
      let existingArticleIds = {};

      if (existingArticleIdsString) {
        existingArticleIds = JSON.parse(existingArticleIdsString);
      }

      // Check if the article ID already exists in the array
      const article = existingArticleIds[item.ID];
      const hasRewardPoint = await hasRewardPoints(3);
      if (!article) {
        if (hasRewardPoint) {
          // If not present, add the article  to the array
          existingArticleIds[item.ID] = item;
          // console.log('Article ID added to list:', item.ID);
          const updatedStatus = [...savedArticleStatus];
          updatedStatus[item.ID] = true;
          setSavedArticleStatus(updatedStatus);
        } else {
          navigation.navigate('ShowError', 'to Save Job article');
        }
      } else {
        // If present, remove the article ID from the array
        delete existingArticleIds[item.ID];
        // console.log('Article ID removed from list:');
        const updatedStatus = [...savedArticleStatus];
        updatedStatus[item.ID] = false;
        setSavedArticleStatus(updatedStatus);
        // console.log(existingArticleIds, 'existingArticleIds');
      }

      // Save the updated array back to AsyncStorage
      await AsyncStorage.setItem(
        'savedArticles',
        JSON.stringify(existingArticleIds),
      );
    } catch (error) {
      console.error('Error toggling article ID:', error);
    }
  };

  const borderColor = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [backgroundCard, secondary], // Black to red flicker
  });
  return (
    <TouchableOpacity
      key={index}
      style={
        isduplicate
          ? {
              ...styles.touchable,
              backgroundColor: secondary,
              color: text2,
            }
          : {
              ...styles.touchable,
              backgroundColor: backgroundCard,
            }
      }
      className="mx-2 mb-2 pb-2 space-y-1"
      onPress={() => openItem()}>
      <Animated.View style={isFlickering && {backgroundColor: borderColor}}>
        <View className="flex-row items-center  shadow-sm justify-center">
          <Image
            // source={{ uri: item.featured_image }}
            source={
              !item.featured_image
                ? require('../../assets/d.png')
                : {uri: item.featured_image}
            }
            style={{
              width: heightPercentageToDP(7),
              height: heightPercentageToDP(8),
              borderRadius: 7,
            }}
          />
          <View className="w-[70%] pl-3  ">
            <View className="flex-row ">
              {/*time & duplicate indicator*/}
              <Text className="text-xs italic text-gray-900 dark:text-white">
                {formatDate(item.date)}
              </Text>
              <Text className="text-xs italic text-orange-600 dark:text-orange-300">
                {isduplicate ? '  duplicate/similar Post' : null}
              </Text>
            </View>
            {/*title*/}

            <Text
              className="text-neautral-800 capitalize max-w-[90%] dark:text-white"
              style={{
                fontFamily: 'RobotoBold',
                fontSize: heightPercentageToDP(1.7),
              }}>
              {item?.title?.lenght > 51
                ? item?.title?.substring(0, 51) + '...'
                : item?.title}
            </Text>
            {/* categories */}
            <Text className="text-xs font-bold text-gray-900 dark:text-white">
              {/* {specs.map((item = <Text> {item} </Text>))} */}
              {specs?.length > 35 ? specs.substring(0, 35) + '..' : specs}
            </Text>
          </View>
          {/* bookMar */}
          <View
            className="pr-6 "
            style={{opacity: savedArticleStatus[item.ID] ? 1 : 0.4}}>
            <TouchableOpacity onPress={() => toggleArticleId(item, index)}>
              <Icon
                name="suitcase"
                size={20}
                color={savedArticleStatus[item.ID] ? primary : tertiary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles2 = StyleSheet.create({
  item: {
    borderWidth: 2,
    // Default border color
  },
});

export const NewSingleJobEntryNew = memo(NewSingleJobEntry);

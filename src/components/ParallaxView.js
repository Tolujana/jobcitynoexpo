import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import RenderHtml from 'react-native-render-html';
import BannerAdComponent from './BannerAdComponent';
import {fetchNewDataFromAPI} from '../util/funtions';
import {ThemeContext} from '../theme/themeContext';
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const ParallaxView = ({content, mainContent, image, tags, id}) => {
  const theme = useContext(ThemeContext);
  const {
    primary,
    background,
    text,
    transBackground,
    boldText,
    text2,
    tertiary,
  } = theme.colors;
  const [duplicate, setDuplicate] = useState(null);
  const pageStyle = {backgroundColor: background, color: text};
  const ForeGroundStyle = {backgroundColor: transBackground, color: text};
  const fulltag = Object.keys(tags);

  function findItemWithNumbers(fulltag, id) {
    return (
      fulltag.find(item => /\d/.test(item) && item !== `duplicate-${id}`) ||
      null
    );
  }

  // Find the first <b> tag in the article text

  const boldTagIndex =
    mainContent.indexOf('<strong>') || mainContent.indexOf('<b>');

  // Split the article into two parts: before and after the first <b> tag
  const beforeBoldText =
    boldTagIndex !== -1 ? mainContent.slice(0, boldTagIndex) : mainContent;
  const afterBoldText =
    boldTagIndex !== -1 ? mainContent.slice(boldTagIndex) : '';

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, screenHeight * 0.4],
      [0, -screenHeight * 0.3],
    );
    return {
      transform: [{translateY}],
    };
  });

  const tagsStyles = {
    body: {
      backgroundColor: background, // Change background color
      color: text, // Change text color
      fontFamily: 'Arial', // Change font family
      //padding: 10,
      textAlign: 'justify',
    },
    p: {
      color: text, // Paragraph text color
      fontSize: 16, // Paragraph text size
    },
    strong: {
      color: boldText, // Strong text color
    },
  };

  const date = new Date(duplicate?.date);

  const readableDate = date.toLocaleString('en-US', {
    weekday: 'long', // e.g., "Thursday"
    year: 'numeric', // e.g., "2024"
    month: 'long', // e.g., "December"
    day: 'numeric', // e.g., "26"
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // For AM/PM format
  });
  useEffect(() => {
    if (fulltag.includes('duplicate')) {
      const foundTag = findItemWithNumbers(fulltag, id);
      const loadDuplicatePost = async () => {
        const duplicateId = foundTag.replace('duplicate-', '');
        // console.log('dup', duplicateId);

        const url = `https://public-api.wordpress.com/rest/v1.2/sites/screammie.info/posts/?include=${duplicateId}`;
        const response = await fetchNewDataFromAPI(url);
        setDuplicate(response.posts[0]);
      };

      loadDuplicatePost();
    }
  }, []);
  //console.log('fpoid', duplicate.author);
  const renderersProps = {
    p: {
      // You can add any additional props for <p> tags here
    },
  };
  const foregroundAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, screenHeight * 0.4],
      [0, -screenHeight * 0.15],
    );
    return {
      transform: [{translateY}],
    };
  });

  return (
    <View style={[styles.container, pageStyle]}>
      <Animated.Image
        source={{uri: image}}
        style={[styles.backgroundImage, backgroundAnimatedStyle]}
      />
      <Animated.ScrollView
        contentContainerStyle={styles.scrollViewContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.foregroundContent,
            ForeGroundStyle,
            foregroundAnimatedStyle,
          ]}>
          {content}
        </Animated.View>
        <View style={{width: screenWidth * 0.95}}>
          <BannerAdComponent />

          {/* Start of Article (Before First <b> Tag) */}

          {duplicate && (
            <View style={{backgroundColor: primary, flex: 1}}>
              <TouchableOpacity>
                <Text style={{color: text2, margin: 10}}>
                  "Job post Might be similar to:{'\n'}
                  {duplicate?.title} written by {duplicate?.author?.name} on{' '}
                  {readableDate}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <RenderHtml
            contentWidth={screenWidth * 0.95}
            source={{html: beforeBoldText}}
            tagsStyles={tagsStyles}
            baseStyle={{paddingHorizontal: 16, marginVertical: 10}}
          />

          {/* Ad Just Before the First <b> Tag */}
          {boldTagIndex !== -1 && <BannerAdComponent />}

          {/* Rest of the Article (Including the <b> Tag and After) */}
          <RenderHtml
            contentWidth={screenWidth * 0.95}
            source={{html: afterBoldText}}
            tagsStyles={tagsStyles}
            baseStyle={{paddingHorizontal: 16, marginVertical: 10}}
          />

          {/* End Ad */}
          <BannerAdComponent />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: screenWidth,
    height: screenHeight * 0.4,
    resizeMode: 'cover',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foregroundContent: {
    width: screenWidth,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    marginTop: 250, // Adjust this value as needed to position the foreground content
  },
});

export default ParallaxView;

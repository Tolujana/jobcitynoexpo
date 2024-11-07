import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import RenderHtml from 'react-native-render-html';
import BannerAdComponent from './BannerAdComponent';
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const ParallaxView = ({content, mainContent, image}) => {
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
      backgroundColor: 'ffffff', // Change background color
      color: '#000', // Change text color
      fontFamily: 'Arial', // Change font family
      //padding: 10,
      textAlign: 'justify',
    },
    p: {
      color: '#333', // Paragraph text color
      fontSize: 16, // Paragraph text size
    },
    strong: {
      color: '#000', // Strong text color
    },
  };

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
    <View style={styles.container}>
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
          style={[styles.foregroundContent, foregroundAnimatedStyle]}>
          {content}
        </Animated.View>
        <View style={{width: screenWidth * 0.95}}>
          <BannerAdComponent />

          {/* Start of Article (Before First <b> Tag) */}
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

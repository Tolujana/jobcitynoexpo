import {useNavigation, useIsFocused} from '@react-navigation/native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import {SplashContext, useSplashContext} from '../context/SplashContext';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window'); // Get screen dimensions
let data;
const SplashScreen2 = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const animationPlayed = useRef(false);
  const translateX = useRef(new Animated.Value(-width / 2)).current; // Start off-screen (left)
  const translateY = useRef(new Animated.Value(-height / 2)).current; // Start off-screen (top)
  const [isNotificationChecked, setIsNotificationChecked] = useState(false);
  // const {setIsSplashFinished, isSplashFinished} = useContext(SplashContext);
  const [isAnimationDone, setIsAnimationDone] = useState(false);

  useEffect(() => {
    if (animationPlayed.current) return; // Prevent re-running

    animationPlayed.current = true; // Mark animation as played

    // Start the animation sequence
    Animated.sequence([
      // Slide to 30 pixels below the center
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0 + 30, // Subtract half of the logo height and add 30px
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Bounce up to 30 pixels above the center
      Animated.timing(translateY, {
        toValue: 0 - 30, // Subtract half of the logo height and subtract 30px
        duration: 400,
        useNativeDriver: true,
      }),
      // Settle at the center
      Animated.timing(translateY, {
        toValue: 0, // Center the logo vertically
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (isFocused) {
        navigation.replace('HomeTabs');
      }

      // Navigate to Home after animatio
    });
  }, [translateY, translateX, navigation]);

  return (
    <ImageBackground
      source={require('../../assets/backgroundSplash2.jpg')} // Replace with your image path
      style={styles.background}>
      <Animated.Image
        source={require('../../assets/logoCurved.png')} // Replace with your logo path
        style={[
          styles.logo,
          {
            transform: [{translateX: translateX}, {translateY: translateY}],
          },
        ]}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    position: 'relative', // Explicitly making this the reference point
  },
  logo: {
    width: 150, // Logo width
    height: 150, // Logo height
    resizeMode: 'contain',
    position: 'absolute', // Position to allow animation
    width: 150,
    height: 150,
    resizeMode: 'contain',
    position: 'absolute', // Absolute positioning for precise placement
    // Center vertically (subtract half the logo's height)
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Explicitly making this the reference point
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Simulates a frosted/blurred effect
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen2;

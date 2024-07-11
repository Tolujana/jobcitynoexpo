import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  NativeAd,
  useNativeAd,
  MediaView,
  HeadlineView,
  TaglineView,
  CallToActionView,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.NATIVE_AD : 'your-admob-native-ad-unit-id';

const NativeAdCon = () => {
  const {ad, isLoaded, loadAd} = useNativeAd(adUnitId);

  useEffect(() => {
    loadAd();
  }, [loadAd]);

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <NativeAd style={styles.nativeAdContainer} ad={ad}>
      <MediaView style={styles.mediaView} />
      <HeadlineView style={styles.headline} />
      <TaglineView style={styles.tagline} />
      <CallToActionView style={styles.callToAction} />
    </NativeAd>
  );
};

const styles = StyleSheet.create({
  nativeAdContainer: {
    width: '100%',
    height: 300,
    backgroundColor: 'white',
    padding: 10,
  },
  mediaView: {
    width: '100%',
    height: 150,
  },
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: 14,
    marginVertical: 5,
  },
  callToAction: {
    fontSize: 16,
    color: 'blue',
  },
});

export default NativeAdCom;

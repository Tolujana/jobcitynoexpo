import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  AdMobNative,
  AdMobNativeMediaView,
  AdMobNativeAdView,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.NATIVE_AD
  : 'ca-app-pub-7993847549836206/5095174466';

const NativeAdComponent = () => {
  const [nativeAd, setNativeAd] = useState(null);

  useEffect(() => {
    // Function to request a native ad
    const fetchNativeAd = async () => {
      try {
        const ad = await AdMobNative?.requestAd(
          'ca-app-pub-7993847549836206/5095174466',
        );
        setNativeAd(ad);
      } catch (error) {
        console.error('Failed to load native ad:', error);
      }
    };

    fetchNativeAd();
  }, []);

  if (!nativeAd) {
    return <Text>Loading...</Text>;
  }

  return (
    <AdMobNativeAdView style={styles.nativeAdContainer} ad={nativeAd}>
      <AdMobNativeMediaView style={styles.mediaView} />
      <View style={styles.textContainer}>
        <Text style={styles.headline}>{nativeAd.headline}</Text>
        <Text style={styles.body}>{nativeAd.body}</Text>
        <Text style={styles.callToAction}>{nativeAd.callToAction}</Text>
      </View>
    </AdMobNativeAdView>
  );
};

const styles = StyleSheet.create({
  nativeAdContainer: {
    width: '100%',
    height: 300,
    backgroundColor: 'white',
  },
  mediaView: {
    width: '100%',
    height: 150,
  },
  textContainer: {
    padding: 10,
  },
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 14,
    marginVertical: 5,
  },
  callToAction: {
    fontSize: 16,
    color: 'blue',
  },
});

export default NativeAdComponent;

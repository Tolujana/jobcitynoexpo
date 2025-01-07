// BannerAdComponent.js
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const BannerAdComponent = () => {
  // Replace TestIds.BANNER with your real ad unit ID when you're ready for production
  const adUnitId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-7993847549836206/9500075214';

  return (
    <View style={styles.adContainer}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          // console.log('Ad loaded successfully');
        }}
        onAdFailedToLoad={error => {
          console.error('Ad failed to load:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default BannerAdComponent;

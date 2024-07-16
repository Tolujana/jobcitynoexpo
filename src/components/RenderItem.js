import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import SingleJobEntry from './SingleJobEntry';
import SingleJobEntryNew from './SingleJobEntryv2';
import NewSingleJobEntryNew from './NewSingleJobEntryNew';

import {
  BannerAd,
  BannerAdSize,
  NativeAdView,
  TestIds,
} from 'react-native-google-mobile-ads';
import NativeAdComponent from './NativeAdComponent';

const bannerAdUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-7993847549836206/9500075214';
// const adUnitId = __DEV__ ? TestIds.NATIVE_AD_VIDEO : 'your-ad-unit-id';
//
// const nativeAdManager = new AdMobNativeAdsManager("ca-app-pub-3940256099942544/2247696110"); // Test ID

const RenderItem = ({item, index, savedArticles}) => {
  //const openItem = (item) => navigation.navigate("JobsDetails", item);
  const [loaded, setLoaded] = useState(false);

  return (index + 1) % 4 !== 0 ? (
    <NewSingleJobEntryNew
      item={item}
      index={index}
      savedArticles={savedArticles}
    />
  ) : (
    <View
      onChange={inView => {
        console.log('invew', inView);
        setIsLoadMore(inView);
      }}>
      <NewSingleJobEntryNew
        item={item}
        index={index}
        savedArticles={savedArticles}
      />
      <Text> advert</Text>
      <View>
        {/* <BannerAd
          unitId={bannerAdUnitId}
          size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          style={{
            width: '100%', // Banner width takes up full width
            marginTop: 10,
            marginBottom: 10, // Add some margin for spacing
          }}
          onAdFailedToLoad={error =>
            console.error('Failed to load banner ad:', error)
          }
        /> */}
        
      </View>
    </View>
  );
};

export default RenderItem;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
});

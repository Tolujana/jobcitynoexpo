import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';

import {
  BannerAd,
  BannerAdSize,
  NativeAdView,
  TestIds,
} from 'react-native-google-mobile-ads';
import {NewSingleJobEntryNew} from './NewSingleJobEntryNew';
import BannerAdComponent from './BannerAdComponent';

const bannerAdUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-7993847549836206/9500075214';

const RenderItem = ({item, index, savedArticles}) => {
  //const openItem = (item) => navigation.navigate("JobsDetails", item);
  const [loaded, setLoaded] = useState(false);

  return (index + 1) % 5 !== 0 ? (
    <NewSingleJobEntryNew
      item={item}
      index={index}
      savedArticles={savedArticles}
    />
  ) : (
    <View
      onChange={inView => {
        // console.log('invew', inView);
        setIsLoadMore(inView);
      }}>
      <NewSingleJobEntryNew
        item={item}
        index={index}
        savedArticles={savedArticles}
      />
      <Text> advert</Text>
      <View>
        <BannerAdComponent />
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

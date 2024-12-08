import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Button,
  Platform,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Loader from '../components/Loader';
import NewsSection from '../components/NewsSection';
import {useQuery, useInfiniteQuery} from '@tanstack/react-query';

import {IOScrollView, InView} from 'react-native-intersection-observer';
import useCustomFetch from '../util/CustomFetch';
import RenderItem from '../components/RenderItem';
// import ApiUrlManager from '../components/ApiUrlManager';
import {sendNotification} from '../components/BackgroundFetchTask';
import ApiUrlManager from '../components/ApiUrlManager';

import {NativeModules} from 'react-native';

import OnesignalSelection from '../components/OnesignalSelection';
import FormScreen from '../components/FormScreen';
import ApiUrlManager2 from '../components/ApiUrlManager2';

const {BatteryOptimization} = NativeModules;

export default function UrlNotificationScreen() {
  const [jobs, setJobs] = useState([]);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [isBatteryOptimized, setIsBatteryOptimized] = useState(true);

  const url =
    'https://public-api.wordpress.com/rest/v1.2/sites/screammie.info/posts/ ';
  const params = {search: 'word', page: page, number: 6};
  const {data, loading, error} = useCustomFetch(url, {params});

  useEffect(() => {
    if (data) {
      setPage(1);
    }
    if (Platform.OS === 'android') {
      checkBatteryOptimization();
    }
  }, []);
  const loadMorePost = () => {
    if (!loading) {
      setPage(page + 1);
    }
  };

  const renderfunction = ({item, index}) => (
    <RenderItem item={item} data={data} index={index} />
  );
  const openBatteryOptimizationSettings = packageName => {
    if (Platform.OS === 'android') {
      Linking.openURL(`package:${packageName}`);
    }
  };
  const checkBatteryOptimization = async () => {
    if (Platform.OS !== 'android') return;

    try {
      const packageName = 'com.jobcity'; // Replace with your app's package name
      //const intent = await Linking.canOpenURL(`package:${packageName}`);

      const isIgnoringBatteryOptimizations =
        await BatteryOptimization.isBatteryOptimizationDisabled();
      console.log(
        'Battery optimization disabled:',
        isIgnoringBatteryOptimizations,
      );

      if (!isIgnoringBatteryOptimizations) {
        setIsBatteryOptimized(false);
        // Alert.alert(
        //   'Battery Optimization',
        //   'Please disable battery optimization for better app NOtifications.',
        //   [
        //     {
        //       text: 'Cancel',
        //       style: 'cancel',
        //     },
        //     {
        //       text: 'Open Settings',
        //       onPress: () => openBatteryOptimizationSettings(packageName),
        //     },
        //   ],
        //   {cancelable: false},
        // );
      } else {
        setIsBatteryOptimized(true);
      }
    } catch (error) {
      console.error('Battery optimization check failed', error);
    }
  };

  return (
    <SafeAreaView>
      <ApiUrlManager />
      {!isBatteryOptimized && (
        <Button
          style={{width: 70}}
          title="Disable Battery Optimization to improve notifications"
          onPress={openBatteryOptimizationSettings}
        />
      )}
    </SafeAreaView>
  );
}

import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Button,
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
import OnesignalSelection from '../components/OnesignalSelection';
import FormScreen from '../components/FormScreen';
import ApiUrlManager2 from '../components/ApiUrlManager2';

export default function UrlNotificationScreen() {
  const [jobs, setJobs] = useState([]);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const url =
    'https://public-api.wordpress.com/rest/v1.2/sites/screammie.info/posts/ ';
  const params = {search: 'word', page: page, number: 6};
  const {data, loading, error} = useCustomFetch(url, {params});

  useEffect(() => {
    if (data) {
      setPage(1);
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

  return (
    <SafeAreaView>
      <ApiUrlManager />
      {/* <ApiUrlManager2 /> */}
      {/* <FormScreen /> */}
    </SafeAreaView>
  );
}

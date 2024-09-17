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
import useCustomFetch from '../util/Functions';
import RenderItem from '../components/RenderItem';
// import ApiUrlManager from '../components/ApiUrlManager';
import {sendNotification} from '../components/BackgroundFetchTask';
import ApiUrlManager from '../components/ApiUrlManager';
import OnesignalSelection from '../components/OnesignalSelection';

export default function Home() {
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
      <Text>Home</Text>
      <ApiUrlManager />
      <OnesignalSelection />
      <Button
        title="Click Me"
        onPress={() => sendNotification('imaworking', 'cool')}
      />

      {loading && page === 1 ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <FlatList
          data={data?.posts}
          renderItem={renderfunction}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={loadMorePost}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            loading && page > 1 ? <ActivityIndicator size="large" /> : null
          }
        />
      )}

      {/* {loading && page === 1 ? (
        <ActivityIndicator size="large" />}

      <IOScrollView
        contentContainerStyle={{
          paddingBottom: hp(70),
        }}
      >
        <NewsSection label="News" newsProps={jobs} />

        <InView
          onChange={(inview) => {
            setIsLoadMore(inview);
          }}
        >
          <Text>Visible</Text>
        </InView>
      </IOScrollView> */}
    </SafeAreaView>
  );
}

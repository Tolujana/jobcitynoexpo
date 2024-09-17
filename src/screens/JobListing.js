import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Loader from '../components/Loader';
import NewsSection from '../components/NewsSection';
import {useQuery, useInfiniteQuery} from '@tanstack/react-query';

import {IOScrollView, InView} from 'react-native-intersection-observer';
import useCustomFetch from '../util/Functions';
import RenderItem from '../components/RenderItem';

export default function JobListing({category, search}) {
  const [jobs, setJobs] = useState([]);
  const [isLoadMore, setIsLoadMore] = useState(false);

  const [page, setPage] = useState(1);
  // const urls =
  //   "https://public-api.wordpress.com/rest/v1.2/sites/en.blog.wordpress.com/posts/?category=Editing&number=5&page=1";
  const url =
    'http://public-api.wordpress.com/rest/v1.2/sites/en.blog.wordpress.com/posts/';
  const params = search
    ? {search: search, page: page, number: 10}
    : category
    ? {category: category.title, page: page, number: 10}
    : {page: page, number: 4};
  const {data, loading, error} = useCustomFetch(url, {params});

  useEffect(() => {
    if (data) {
      setPage(1);
    }
  }, []);

  useEffect(() => {
    if (data) {
      setPage(1);
      console.log(data.posts.length);
    }
  }, []);

  const loadMorePost = () => {
    if (!loading) {
      setPage(prev => prev + 1);
    }
  };

  const renderfunction = ({item, index}) => (
    <RenderItem item={item} data={data} index={index} />
  );

  return (
    <SafeAreaView>
      <Text className="py-3">{category ? category.title : search}</Text>

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
          onEndReachedThreshold={0.5}
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

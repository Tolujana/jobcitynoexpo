import React, {useState, useEffect, useCallback, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  LogBox,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import RenderItem from '../components/RenderItem';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {AppContext} from '../context/AppContext';
import {
  useInfiniteQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchData = async ({pageParam = 1, queryKey}) => {
  const [, queryParam] = queryKey;
  const params = {
    page: pageParam,
    ...queryParam, // Include additional query parameters here
  };

  const url =
    'https://public-api.wordpress.com/rest/v1.2/sites/screammie.info/posts/?';
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = `${url}${queryString}`;
  //console.log('this is url', fullUrl);
  const response = await axios.get(url, {
    params: {
      page: pageParam,
      ...queryParam, // Include additional query parameters here
    },
  });

  return response.data.posts;
};

const NewListing = ({category, search}) => {
  const [page, setPage] = useState(1);
  const queryParam = search
    ? {search: search.slug, number: 7}
    : category
    ? {category: category?.slug, number: 10}
    : {number: 7};
  const [savedArticles, setSavedArticles] = useState({});
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [category?.slug, queryParam],
    queryFn: fetchData,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      // Assuming the API returns `hasMore` to indicate more pages
      // console.log(lastPage, "lastpage", pages, "pages");
      return lastPage.length ? pages.length + 1 : undefined;
    },
  });

  //console.log(hasNextPage, "hasnextpage");
  // console.log(
  //   data?.pages.flatMap((page) => page),
  //   "flated dates"
  // );

  const handleLoadMore = () => {
    fetchNextPage();
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchSavedArticle = async () => {
        const articles = await getSavedArticle();
        setSavedArticles(articles);
        // setBookmarkNumber(Object.keys(articles).length);
      };
      fetchSavedArticle();
    }, []),
  );
  const getSavedArticle = async () => {
    try {
      const savedArticleJSON = await AsyncStorage.getItem('savedArticles');
      if (savedArticleJSON !== null) {
        return JSON.parse(savedArticleJSON);
      }
    } catch (error) {
      console.log('Error retrieving saved article:', error);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#0000ff" />;
  };
  const footerComponent = () => (
    <View style={{paddingBottom: 100}}>
      <ActivityIndicator size="large" />
      <Text>Footer Content</Text>
    </View>
  );

  const renderfunction = ({item, index}) => (
    <RenderItem item={item} index={index} savedArticles={savedArticles} />
  );

  return (
    <View>
      <Text className="mb-3 text-xl">
        {category ? `${category?.name} jobs` : `${search?.search} Job search`}
      </Text>
      {!data && <ActivityIndicator size="large" />}
      {status === 'error' && <Text>Error: {error.message}</Text>}
      {status === 'success' && (
        <FlatList
          data={data?.pages.flat()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderfunction}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.8}
          //initialNumToRender={7}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="large" />
            ) : (
              !hasNextPage && <Text>No more data</Text>
            )
          }
          getItemLayout={(data, index) => ({
            length: styles.item.height,
            offset: styles.item.height * index,
            index,
          })}
          contentContainerStyle={{paddingBottom: 300}}
          // Trigger onEndReached when the scroll position is within 50% of the bottom
        />
      )}
    </View>
  );
};

export default NewListing;
const styles = StyleSheet.create({
  container: {
    paddingBottom: 100, // Example padding
  },
  item: {
    height: 50, // Fixed height example
    justifyContent: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

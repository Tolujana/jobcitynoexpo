import React, {useState, useEffect, useCallback, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
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
import SearchBox from '../components/SearchBox';

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

  const response = await axios.get(url, {
    params: {
      page: pageParam,
      ...queryParam, // Include additional query parameters here
    },
  });
  console.log(`Request URL: ${fullUrl}`);
  return response.data.posts;
};

function convertToSlug(str) {
  return str.replace(/[^a-zA-Z]/g, '-');
}

const Listing2 = ({route}) => {
  const {category, search} = route.params;
  const [page, setPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState(category);
  const [currentSearch, setCurrentSearch] = useState(search);
  console.log('this is listing category', category);
  const queryParam = search
    ? {search: currentSearch, page: page, number: 7}
    : category
    ? {category: currentCategory, number: 10}
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
    queryKey: [category, queryParam],
    queryFn: fetchData,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      // Assuming the API returns `hasMore` to indicate more pages
      // console.log(lastPage, "lastpage", pages, "pages");
      return lastPage.length ? pages.length + 1 : undefined;
    },
  });

  const handleLoadMore = () => {
    fetchNextPage();
  };

  useEffect(() => {
    // Update the state whenever category or search changes
    if (category && category !== currentCategory) {
      setCurrentCategory(category);
    }
    if (search && search !== currentSearch) {
      setCurrentSearch(search);
    }
  }, [category, search]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchSavedArticle = async () => {
        const articles = await getSavedArticle();
        setSavedArticles(articles);
        // setBookmarkNumber(Object.keys(articles).length);
      };
      fetchSavedArticle();
      //fetchData();
      // if (category && category !== currentCategory) {
      //   setCurrentCategory(category);
      //   fetchData();
      // }
      // if (search && search !== currentSearch) {
      //   setCurrentSearch(search);

      // }
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
      <Text className="mb-3 text-xl">{category ? category : search}</Text>
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

export default Listing2;
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

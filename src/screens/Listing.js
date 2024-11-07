import React, {useState, useEffect, useCallback, useContext} from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import axios from 'axios';
import RenderItem from '../components/RenderItem';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {AppContext} from '../context/AppContext';

const Listing = ({category, search}) => {
  const {data, loading, error, fetchData} = useContext(AppContext);
  // const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  // const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [key, setKey] = useState(0);
  const url = category
    ? `http://public-api.wordpress.com/rest/v1.2/sites/en.blog.wordpress.com/posts/?category=${category.title}`
    : `http://public-api.wordpress.com/rest/v1.2/sites/en.blog.wordpress.com/posts/?search=${search}`;
  console.log(url);
  const params = search
    ? {search: search, page: page, number: 7}
    : category
    ? {page: page, number: 7}
    : {page: page, number: 7};

  // useEffect(() => {
  //   setKey((prevKey) => prevKey + 1);
  //   console.log("key", key);
  //   return setData([]);
  // }, [category, search]);

  // useEffect(() => {
  //   fetchData();
  // }, []);
  useEffect(() => {
    fetchData(url, params);
  }, []);

  // useEffect(() => {
  //   fetchData();
  // }, [page]);
  // const fetchData = async () => {
  //   if (loading || !hasMore) return;

  //   setLoading(true);

  //   try {
  //     const response = await axios.get(url, {
  //       params: params,
  //     });
  //     console.log(response.data.posts.length, "thisis length");
  //     if (response.data.posts.length > 0) {
  //       setData((prevData) => [...prevData, ...response.data.posts]);
  //     } else {
  //       setHasMore(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleEndReached = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleLoadMore = () => {
    if (!loading) {
      fetchData(url, params);
    }
  };
  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#0000ff" />;
  };

  const renderfunction = ({item, index}) => (
    <RenderItem item={item} data={data} index={index} />
  );

  return (
    <SafeAreaView>
      <Text className="mb-3 text-xl">{category ? category.title : search}</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderfunction}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5} // Trigger onEndReached when the scroll position is within 50% of the bottom
        />
      )}
    </SafeAreaView>
  );
};

export default Listing;

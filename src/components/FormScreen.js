import React, {useState, useEffect} from 'react';
import {View, TextInput, Button, FlatList, Text, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FormScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [urlList, setUrlList] = useState([]);

  // Load stored URLs when component mounts
  useEffect(() => {
    const loadUrls = async () => {
      const storedUrls = await AsyncStorage.getItem('urls');
      if (storedUrls) {
        setUrlList(JSON.parse(storedUrls));
      }
    };
    loadUrls();
  }, []);

  // Save a new URL
  const saveUrl = async () => {
    if (!searchTerm.trim()) {
      Alert.alert('Error', 'Please enter a valid URL');
      return;
    }
    const newSearchTerm = formatSearchTerm(searchTerm);
    const concatenateUrl = `https://public-api.wordpress.com/rest/v1.2/sites/screammie.info/posts/?search=${newSearchTerm}&number=1`;
    const newUrlList = [...urlList, concatenateUrl];
    await AsyncStorage.setItem('urls', JSON.stringify(newUrlList));
    setUrlList(newUrlList);
    setSearchTerm(''); // Clear input
  };
  function formatSearchTerm(searchTerm) {
    // Replace spaces with %20 for URL encoding
    return searchTerm.trim().replace(/\s+/g, '%20');
  }
  return (
    <View style={{padding: 20}}>
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Enter URL"
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
      />
      <Button title="Add URL" onPress={saveUrl} />
      <FlatList
        data={urlList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <Text>{item}</Text>}
        style={{marginTop: 20}}
      />
    </View>
  );
};

export default FormScreen;

import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeModules} from 'react-native';
import {ThemeContext} from '../theme/themeContext';

const {ArticleScheduler} = NativeModules;

const ApiUrlManager2 = () => {
  const [urlName, setUrlName] = useState('');
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState([]);
  const theme = useContext(ThemeContext);
  const {primary, background, text, text2, secondary, tertiary} = theme.colors;

  useEffect(() => {
    loadUrls();
  }, []);

  const loadUrls = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('apiList');
      if (jsonValue != null) {
        setUrls(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addUrl = async () => {
    try {
      const newUrls = [...urls, url];
      setUrls(newUrls);
      const jsonValue = JSON.stringify(newUrls);
      await AsyncStorage.setItem('apiList', jsonValue);
      setUrlName('');
      setUrl('');
      ArticleScheduler.rescheduleJob();
    } catch (e) {
      console.error(e);
    }
  };

  const removeUrl = async key => {
    try {
      const {[key]: _, ...newUrls} = urls;
      setUrls(newUrls);
      const jsonValue = JSON.stringify(newUrls);
      await AsyncStorage.setItem('apiList', jsonValue);
    } catch (e) {
      console.error(e);
    }
  };

  const renderItems = ({item}) => (
    <View style={styles.itemContainer}>
      <Text>
        {item[0]}: {item[1]}
      </Text>
      <TouchableOpacity onPress={() => removeUrl(item[0])}>
        <Text style={styles.removeButton}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={[styles.container, {backgroundColor: background}]}>
      {/* <TextInput
        style={styles.input}
        placeholder="Enter API Name"
        value={urlName}
        onChangeText={setUrlName}
      /> */}
      <TextInput
        style={styles.input}
        placeholder="Enter API URL"
        value={url}
        onChangeText={setUrl}
      />
      <Button title="Add URL" onPress={addUrl} />
      <FlatList
        data={Object.entries(urls)}
        keyExtractor={item => item[0]}
        removeClippedSubviews={true}
        renderItem={renderItems}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  removeButton: {
    color: 'red',
  },
});

export default ApiUrlManager2;

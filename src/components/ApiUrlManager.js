import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeModules} from 'react-native';

const {ArticleScheduler} = NativeModules;

const API_URLS_KEY = 'apiList';

const ApiUrlManager = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [apiUrls, setApiUrls] = useState([]);

  useEffect(() => {
    const loadApiUrls = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(API_URLS_KEY);
        const urls = jsonValue != null ? JSON.parse(jsonValue) : [];
        setApiUrls(urls);
        console.log('this is keyfrom second', urls);
      } catch (e) {
        console.error('Failed to load API URLs:', e);
      }
    };

    loadApiUrls();
  }, []);

  const addApiUrl = async () => {
    try {
      if (apiUrl) {
        //const slug = encodeURIComponent(apiUrl);
        const search = apiUrl;
        const slug = search;
        const newUrl = {slug, search};
        //console.log('new', newUrl);

        if (!apiUrls.some(url => url.slug === newUrl.slug)) {
          const newUrls = [...apiUrls, newUrl];
          //console.log('newurl', newUrls);
          setApiUrls(newUrls);
          await AsyncStorage.setItem(API_URLS_KEY, JSON.stringify(newUrls));
          setApiUrl('');
          await ArticleScheduler.rescheduleJob();
        }
      }
    } catch (error) {
      console.error('Failed to reschedule job:', error);
    }
  };

  const removeApiUrl = async urlToRemove => {
    const newUrls = apiUrls.filter(url => url.slug !== urlToRemove.slug);
    setApiUrls(newUrls);
    await AsyncStorage.setItem(API_URLS_KEY, JSON.stringify(newUrls));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API URL Manager</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter KeyWord"
        value={apiUrl}
        onChangeText={setApiUrl}
      />
      <TouchableOpacity style={styles.addButton} onPress={addApiUrl}>
        <Text style={styles.addButtonText}>Add URL</Text>
      </TouchableOpacity>
      <FlatList
        data={apiUrls}
        keyExtractor={item => item.slug}
        renderItem={({item}) => (
          <View style={styles.urlContainer}>
            <Text style={styles.urlText}>{item.search}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeApiUrl(item)}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 2,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    height: 50,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  list: {
    marginTop: 20,
  },
  listContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  urlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  urlText: {
    flex: 1,
    marginRight: 10,
  },
  removeButton: {
    backgroundColor: '#ff5252',
    padding: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
  },
});

export default ApiUrlManager;

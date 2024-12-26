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
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {IOScrollView, InView} from 'react-native-intersection-observer';
import useCustomFetch from '../util/CustomFetch';
import RenderItem from '../components/RenderItem';
// import ApiUrlManager from '../components/ApiUrlManager';
import {sendNotification} from '../components/BackgroundFetchTask';
import ApiUrlManager from '../components/ApiUrlManager';
import {NativeModules} from 'react-native';
import {ThemeContext} from '../theme/themeContext';

const {BatteryOptimization} = NativeModules;

export default function KeywordNotificationScreen() {
  const [jobs, setJobs] = useState([]);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [isBatteryOptimized, setIsBatteryOptimized] = useState(true);
  const theme = useContext(ThemeContext);
  const {primary, background, text, text2, secondary, tertiary} = theme.colors;
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
    <SafeAreaView style={{backgroundColor: background, flex: 1}}>
      <ApiUrlManager />
      {!isBatteryOptimized && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: primary,
            }}>
            <TouchableOpacity
              style={[
                styles.addButton,
                {backgroundColor: primary, color: text2},
              ]}
              onPress={openBatteryOptimizationSettings}>
              <Text style={[styles.addButtonText, {color: text2}]}>
                Disable Battery Optimization to improve notifications
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
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
    padding: 15,
    borderRadius: 10,
    border: 1,
  },
  addButtonText: {
    textAlign: 'center',
    alignItems: 'center',
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

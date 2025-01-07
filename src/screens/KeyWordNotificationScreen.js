import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Button,
  Modal,
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
import {
  OpenOptimizationSettings,
  BatteryOptEnabled,
} from 'react-native-battery-optimization-check';
const {BatteryOptimization} = NativeModules;

export default function KeywordNotificationScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      checkBatteryOptimization2();
    }
  }, []);
  const loadMorePost = () => {
    if (!loading) {
      setPage(page + 1);
    }
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
    OpenOptimizationSettings();
  };
  const renderfunction = ({item, index}) => (
    <RenderItem item={item} data={data} index={index} />
  );

  const checkBatteryOptimization2 = async () => {
    const isOptimized = await BatteryOptEnabled();
    if (isOptimized) {
      setIsModalVisible(true);
      setIsBatteryOptimized(false);
    }
  };

  const CustomModal = () => (
    <Modal
      visible={isModalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleCloseModal}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Disable Battery Optimization</Text>
          <Text style={styles.modalText}>
            Follow these steps to disable battery optimization for better
            performance:
          </Text>
          <Text style={styles.steps}>
            1. Click "Got it!" button below to navigate to "Battery Optimization
            Settings." {'\n'}
            2. Select "All Apps" from the dropdown at the top ( this is so you
            can see all apps). {'\n'}
            3. Locate Jobcity in the list. {'\n'}
            4. Tap the app and choose "Don't optimize." or disable optimization
          </Text>

          {/* Buttons Section */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.buttonText}>later</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleCloseModal}>
              <Text style={styles.buttonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={{backgroundColor: background, flex: 1}}>
      <CustomModal />
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
              onPress={() => setIsModalVisible(true)}>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  openButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  steps: {
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 15,
    color: '#333',
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  confirmButton: {
    backgroundColor: '#28a745',
  },
});

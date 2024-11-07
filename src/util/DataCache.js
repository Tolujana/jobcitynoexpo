// DataCache.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useState, useEffect} from 'react';

const DataContext = createContext();

const DataProvider = ({children}) => {
  const [data, setData] = useState(null);
  const [previousData, setPreviousData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStoredData = async storageKey => {
    const storedData = await AsyncStorage.getItem(storageKey);
    setPreviousData(JSON.parse(storedData));
  };

  const refreshData = async (storageKey, url) => {
    setIsRefreshing(true);
    const response = await fetch(url);
    const newData = await response.json();
    await AsyncStorage.setItem(storageKey, JSON.stringify(newData));
    setData(newData);
    setIsRefreshing(false);
  };

  return (
    <DataContext.Provider
      value={{data, previousData, fetchStoredData, refreshData, isRefreshing}}>
      {children}
    </DataContext.Provider>
  );
};

export {DataContext, DataProvider};

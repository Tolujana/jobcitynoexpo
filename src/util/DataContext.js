import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
const DataContext = createContext();

// Create a provider component
export const DataProvider = ({children}) => {
  const [menuData, setMenuData] = useState(null);
  const [previousData, setPreviousData] = useState(null);
  const [menuLoading, setLoading] = useState(false);

  const fetchData = async url => {
    if (!url) {
      console.error('Error: URL is required to fetch data.');
      return;
    }

    setLoading(true);

    try {
      // Load previous data from AsyncStorage
      const cachedData = await AsyncStorage.getItem(`data:${url}`);
      if (cachedData) {
        setPreviousData(JSON.parse(cachedData));
      }

      // Fetch new data from the provided URL
      const newData = await fetchNewDataFromAPI(url);

      if (newData) {
        setMenuData(newData);

        // Compare new data with previous data
        if (cachedData) {
          const isEqual = JSON.stringify(newData) === cachedData;
          console.log(
            'Data Comparison:',
            isEqual ? 'No changes' : 'Data updated',
          );
        }

        // Store new data in AsyncStorage (keyed by URL)
        await AsyncStorage.setItem(`data:${url}`, JSON.stringify(newData));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Example: Automatically fetch data from a default URL on app launch
    const defaultUrl =
      'https://screammie.info/wp-json/wp/v2/categories?per_page=100'; // Replace with your default URL
    fetchData(defaultUrl);
  }, []);

  return (
    <DataContext.Provider
      value={{menuData, previousData, menuLoading, fetchData}}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the DataContext
export const useData = () => useContext(DataContext);

// Function to fetch data from a URL
const fetchNewDataFromAPI = async url => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Assuming the response is in JSON format
    return data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    return null; // Return null or handle it as needed
  }
};

import AsyncStorage from '@react-native-async-storage/async-storage';
// function to update specialization list in settings page
export const checkAndFetchData = async () => {
  try {
    // Retrieve stored data (includes timestamp and actual data)
    const storedData = await AsyncStorage.getItem('specs');

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const {data, timestamp} = parsedData;

      const now = Date.now();
      const fortyEightHours = 48 * 60 * 60 * 1000;

      if (timestamp && now - timestamp < fortyEightHours) {
        // Use cached data if within 24 hours
        return data || storedData;
      }
    }

    // Fetch new data if no valid cached data exists
    const newData = await fetchNewDataFromAPI();
    if (newData) {
      const newSettings = {
        data: newData,
        timestamp: Date.now(),
      };

      // Save combined object to AsyncStorage
      await AsyncStorage.setItem('settings_data', JSON.stringify(newSettings));
      return newData;
    }
  } catch (error) {
    console.error('Error in checkAndFetchData:', error);
    return null;
  }
};
// function used in CheckAndFetchData for specializations
const fetchNewDataFromAPI = async () => {
  const url =
    'https://screammie.info/wp-json/wp/v2/categories?per_page=100&_fields=name,slug'; // Replace with your actual API URL
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json(); // Assuming JSON response
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};
//function to load user selected specialization in Category selection screen and HOme page
export const loadSelectedspecialization = async (
  setSelectedTopics,
  topic = 'userTopics',
) => {
  try {
    const storedTopics = await AsyncStorage.getItem(topic);

    if (storedTopics) {
      setSelectedTopics(JSON.parse(storedTopics));
    }
  } catch (error) {
    console.error('Failed to load topics:', error);
  }
};

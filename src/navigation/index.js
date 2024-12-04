import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
//import {useColorScheme} from 'nativewind';
import Icon from 'react-native-vector-icons/FontAwesome';
import UrlNotificationScreen from '../screens/UrlNotificationScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import SaveScreen from '../screens/SaveScreen';
import SearchScreen from '../screens/SearchScreen';
//import SplashScreen from '../screens/SplashScreen';
import WelcomScreen from '../screens/WelcomeScreen';
import JobsDetailsScreen from '../screens/JobsDetailsScreen';
//import {FontAwesome} from '@expo/vector-icons';
//import SplashScreens from '../screens/SplashScreen';
import Home from '../screens/Home';
import CategorySelectionScreen2 from '../screens/CategorySelectionScreen2';
import SettingsScreen from '../screens/SettingsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import Listing2 from '../screens/Listing2';
import NewListing from '../screens/NewListing';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function AppNavigation({navigationRef}) {
  //const {colorScheme, toggleColorScheme} = useColorScheme();

  const linking = {
    prefixes: ['https://screammie.info'], // Replace with your actual website URL
    config: {
      screens: {
        Home: 'home', // Maps 'https://yourwebsite.com/home' to HomeScreen
        Post: 'post/:postId', // Maps 'https://yourwebsite.com/post/:postId' to PostScreen
      },
    },
  };
  const TabNavigator = () => {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarIcon: ({focused, size}) => {
            let iconName;
            const initialColour = 'grey';

            const focusedColour = 'blue';

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'SavedJobs') {
              iconName = 'briefcase';
            } else if (route.name === 'Search Jobs') {
              iconName = 'search';
            } else if (route.name === 'Settings') {
              iconName = 'gear';
            }

            // You can return any component that you like here!
            return (
              <Icon
                name={iconName}
                size={size}
                color={focused ? focusedColour : initialColour}
              />
            );
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'grey',
        })}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Search Jobs" component={SearchScreen} />
        <Tab.Screen
          name="SavedJobs"
          component={SaveScreen}
          options={{title: 'Saved Jobs'}}
        />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    );
  };
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="HomeTabs"
        screenOptions={{
          headerShown: false,
        }}>
        {/* <Stack.Screen name="Splashs" component={SplashScreens} /> */}
        <Stack.Screen name="Welcome" component={WelcomScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen
          name="JobsDetails"
          component={JobsDetailsScreen}
          options={{animation: 'slide_from_bottom'}}
        />
        <Stack.Screen name="HomeTabs" component={TabNavigator} />
        <Stack.Screen name="Categories" component={CategorySelectionScreen2} />
        <Stack.Screen name="Form" component={UrlNotificationScreen} />
        <Stack.Screen name="Listing" component={Listing2} />
        <Stack.Screen name="NewListing" component={NewListing} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

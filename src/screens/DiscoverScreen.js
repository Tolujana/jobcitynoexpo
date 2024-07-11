import {View, Text, StatusBar} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
//import {StatusBar} from 'expo-status-bar';
//import { useColorScheme } from "nativewind";

export default function DiscoverScreen() {
  // const {colorScheme, toggleColorScheme} = useColorScheme();
  return (
    <SafeAreaView className="pt-8 bg-white dark:bg-neutral-900">
      <StatusBar />
      {/* header */}
      <View className="px-4 mb-6 justify-between">
        <Text>DiscoverScreen</Text>
      </View>
    </SafeAreaView>
  );
}

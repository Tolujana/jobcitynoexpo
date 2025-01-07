import {View, Text, ActivityIndicator, SafeAreaView} from 'react-native';
import React from 'react';

export default function Loader() {
  return (
    <SafeAreaView
      style={{flex: 1, height: '100%'}}
      className="flex-1 justify-center items-center ">
      <ActivityIndicator
        size=""
        color="blue"
        // style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
      />
    </SafeAreaView>
  );
}

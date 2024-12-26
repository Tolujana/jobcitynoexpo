import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, {useContext, useState} from 'react';
import SearchBox from '../components/SearchBox';
import {ThemeContext} from '../theme/themeContext';

export default function SearchScreen() {
  const theme = useContext(ThemeContext);
  const {background, text, text2, secondry, tertiary} = theme.colors;
  return (
    <View style={{flex: 1, backgroundColor: background}}>
      <SearchBox />
    </View>
  );
}

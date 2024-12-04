import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, {useState} from 'react';

export default function SearchBox({search}) {
  const [focused, setFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  return (
    <View className="flex-row  justify-start items-center border border-gray-300 bg-neutral-100 dark:bg-neutral-800 rounded-full">
      <TouchableOpacity className="pl-2">
        <Icon name="search" size={25} color="gray" />
      </TouchableOpacity>
      <TextInput
        className="pl-3 flex-1 font-medium tracking-wider "
        placeholder={focused ? '' : 'search Jobs'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={'gray'}
        value={search || searchText}
        onChangeText={() => setSearchText(searchText)}
        //onPress={() => navigation.navigate('Search Jobs')}
      />
    </View>
  );
}

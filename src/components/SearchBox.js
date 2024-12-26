import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, {useState} from 'react';
import {handleSubmit} from '../util/funtions';

export default function SearchBox({search}) {
  const [focused, setFocused] = useState(false);
  const [searchText, setSearchText] = useState(null);
  //const [initialSearchText, setInitialSearchText] = useState(search);

  const handleTextChange = text => {
    setSearchText(text);
  };
  return (
    <View className=" flex-row  justify-start items-center border border-gray-300 bg-neutral-100 dark:bg-neutral-800 rounded-full my-2">
      <TouchableOpacity className="pl-2">
        <Icon name="search" size={25} color="gray" />
      </TouchableOpacity>
      <TextInput
        className="pl-3 flex-1 font-medium tracking-wider "
        placeholder={'search Jobs'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
        placeholderTextColor={'gray'}
        value={searchText || search}
        onChangeText={handleTextChange}
        onSubmitEditing={() => handleSubmit(searchText, setSearchText)}
        //onPress={() => navigation.navigate('Search Jobs')}
      />
    </View>
  );
}

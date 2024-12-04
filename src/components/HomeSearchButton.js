import React, {useState, useRef, forwardRef} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {navigationRef} from '../navigation/NotificationNavigate';

const HomeSearchButton = forwardRef((props, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchText, setSearchText] = useState('');
  const inputScale = useState(new Animated.Value(0.2))[0];
  // const inputRef = useRef(null);
  const handleSubmit = () => {
    if (searchText.trim()) {
      navigationRef.current?.navigate('NewListing', {search: searchText});
      //onSearch(text); // Call the onSearch callback with the entered text
      setSearchText(''); // Clear the input field
    }
  };
  const handlePress = () => {
    setIsExpanded(true);
    Animated.timing(inputScale, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      ref.current.focus();
    });
  };

  const handleTextChange = text => {
    setSearchText(text);
  };

  const handleBlur = () => {
    setIsExpanded(false);
    Animated.timing(inputScale, {
      toValue: 0.2,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    inputRef.current.blur();
  };

  return (
    <View
      style={{
        flex: 1,

        margin: 6,
        height: 40,
      }}>
      {isExpanded ? (
        <Animated.View
          style={{
            paddingRight: 15,
            flex: 1,
            height: 200,
            borderRadius: 20,
            borderWidth: 1,
            transform: [{scaleX: inputScale}],
          }}>
          <TextInput
            ref={ref}
            style={styles.input}
            value={searchText}
            onChangeText={handleTextChange}
            placeholder="Search"
            onBlur={handleBlur}
            returnKeyType="search"
            onSubmitEditing={handleSubmit}
          />
        </Animated.View>
      ) : (
        <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={handlePress}>
          <Icon name="search" size={24} color="#333" />
        </TouchableOpacity>
      )}
    </View>
  );
});

export default HomeSearchButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    flex: 1,
  },
  input: {
    width: '80%',

    fontSize: 16,
    paddingHorizontal: 16,
    flex: 1,
  },
});

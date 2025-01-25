import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useContext} from 'react';
import {ThemeContext} from '../theme/themeContext';

export default CustomButton = ({onpress, disable, buttonText}) => {
  const theme = useContext(ThemeContext);
  const {primary, background, text, text2, secondary, tertiary} = theme.colors;

  return (
    <TouchableOpacity
      style={[
        styles.addButton2,
        {
          backgroundColor: disable ? tertiary : primary,
          color: text2,
        },
      ]}
      disabled={disable}
      onPress={onpress}>
      <Text style={[styles.addButtonText, {color: text2}]}>{buttonText}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  section: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  icon: {
    //color: '#555',
    marginRight: 15,
  },
  text: {
    fontSize: 16,
    //color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  addButton: {
    padding: 15,
    borderRadius: 10,
    border: 1,
  },
  addButton2: {
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  addButtonText: {
    textAlign: 'center',
    alignItems: 'center',
    fontSize: 16,
  },
});

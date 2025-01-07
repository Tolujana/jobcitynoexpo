import React, {useContext} from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {ThemeContext} from '../theme/themeContext';
import {useNavigation} from '@react-navigation/native';

const CustomModal = ({visible, onClose}) => {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const {primary, background, text, text2, secondry, tertiary} = theme.colors;
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modalBox, {backgroundColor: primary}]}>
          <Text style={[styles.title, {color: text2}]}>Choose a menu Type</Text>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: background}]}
            onPress={() => {
              onClose();
              navigation.navigate('Categories');
            }}>
            <Text>Add your Specialization(s)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: background}]}
            onPress={() => {
              onClose();
              navigation.navigate('Form');
            }}>
            <Text>Add Custom Keywords/certification(s)</Text>
          </TouchableOpacity>
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
});

export default CustomModal;

import React, {useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ThemeContext} from '../theme/themeContext';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const {primary, background, text, text2, secondary, tertiary} = theme.colors;

  const openPolicy = async () => {
    const url = 'https://screammie.info/privacy-policy/';
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };
  return (
    <ScrollView
      style={[styles.container, {backgroundColor: background, color: text}]}>
      {/* Account Settings Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, {color: primary}]}>
          Notification Settings
        </Text>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('Categories')}>
          <Icon name="briefcase-outline" size={24} style={styles.icon} />
          <Text style={styles.text}>Select Job Specialization</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('Form')}>
          <Icon name="create-outline" size={24} style={styles.icon} />
          <Text style={styles.text}>Keyword Notification</Text>
        </TouchableOpacity>
      </View>

      {/* General Settings Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, {color: primary}]}>General</Text>

        <TouchableOpacity style={styles.item} onPress={openPolicy}>
          <Icon name="lock-closed-outline" size={24} style={styles.icon} />
          <Text style={styles.text}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => alert('Terms of Service')}>
          <Icon name="document-text-outline" size={24} style={styles.icon} />
          <Text style={styles.text}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            Alert.alert(
              'About JObcity',
              `
      Jobcity is a mobile app designed to bring you quick update about Jobs you are interested in.

      Version: 1.2
      Developed by: Screammie Tech
      Copyright: Screammie @ 2024. All rights reserved.

      We hope you enjoy using Jobcity! If you have any questions or feedback, please don't hesitate to contact us.
      `,
              [
                {
                  text: 'OK',
                  onPress: () => console.log('About alert closed'),
                },
              ],
            );
          }}>
          <Icon
            name="information-circle-outline"
            size={24}
            style={styles.icon}
          />
          <Text style={styles.text}>About</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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
});

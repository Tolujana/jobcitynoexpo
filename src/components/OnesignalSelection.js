import React, {useState} from 'react';
import {View, Text, Button, FlatList, TouchableOpacity} from 'react-native';
import OneSignal from 'react-native-onesignal';

const CHANNELS = [
  'Accountancy/accounting',
  'Actuarial Science',
  'Architecture',
  'Banking and Finance',
  'Biochemistry',
  'Biomedical Engineering',
  'Botany',
  'Business Administration',
  'Cell Biology and Genetics',
  'chemical engineering',
  'Chemistry',
  'civil engineering',
  'Computer Engineering',
  'Computer Science',
  'Dentistry',
  'economics',
  'Electrical Engineering',
  'Engineering',
  'Entry level',
  'Estate Management',
  'Finance',
  'Geology',
  'Geophysics',
  'Graduate Trainee',
  'Industrial Chemistry',
  'Industrial Relations and Personnel Management',
  'internship',
  'jobs',
  'Law',
  'Mass Communication',
  'Mechanical Engineering',
  'Medical Laboratory Science',
  'Medicine and Surgery',
  'Metallurgical and Material Engineering',
  'Microbiology',
  'Nursing',
  'Petroleum Engineering',
  'Pharmacology',
  'Pharmacy',
  'Physiotherapy',
  'Sociology',
];

const OnesignalSelection = () => {
  const [selectedChannels, setSelectedChannels] = useState([]);

  // Initialize OneSignal
  //    OneSignal.initialize('61d48177-4dd2-44cf-8da4-408e3e0ebb51');
  // Replace with your OneSignal app ID

  // Function to toggle channel selection
  const toggleChannel = channel => {
    let updatedChannels = selectedChannels;
    if (selectedChannels.includes(channel)) {
      updatedChannels = updatedChannels.filter(c => c !== channel);
      OneSignal.deleteTag(`channel_${channel.toLowerCase()}`); // Remove the tag if deselected
    } else {
      updatedChannels.push(channel);
      OneSignal.addTag(`channel_${channel.toLowerCase()}`, 'true'); // Add the tag if selected
    }
    setSelectedChannels([...updatedChannels]);
  };

  return (
    <View>
      <Text>Select Your Preferred Channels</Text>
      <FlatList
        data={CHANNELS}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => toggleChannel(item)}>
            <Text
              style={{
                padding: 10,
                backgroundColor: selectedChannels.includes(item)
                  ? 'green'
                  : 'grey',
              }}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
      />
      <Button
        title="Save Preferences"
        onPress={() => alert('Preferences saved')}
      />
    </View>
  );
};

export default OnesignalSelection;

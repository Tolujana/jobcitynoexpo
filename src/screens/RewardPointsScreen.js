import React, {useContext} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {ThemeContext} from '../theme/themeContext';

const RewardPointsScreen = () => {
  const theme = useContext(ThemeContext);
  const {primary, background, text, text2, secondary, tertiary} = theme.colors;

  const renderItem = ({item}) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.action}</Text>
      <Text style={styles.cell}>{item.points}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={[styles.title]}>How Points Are Gained</Text>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.row}>
          <Text style={[styles.cell, styles.headerCell]}>Actions</Text>
          <Text style={[styles.cell, styles.headerCell]}>Points used</Text>
        </View>

        {/* Table Rows */}
        <View style={styles.row}>
          <Text style={styles.cell}>Give us a good rating</Text>
          <Text style={styles.cell}>5 points</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>watch Ads</Text>
          <Text style={styles.cell}>3-6 points per ad</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Visit App once a day </Text>
          <Text style={styles.cell}>2 points</Text>
        </View>
      </View>
      {/* table 2  */}
      {/* Title */}
      <Text style={[styles.title, {marginTop: 20}]}>How Points Are Used</Text>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.row}>
          <Text style={[styles.cell, styles.headerCell]}>Actions</Text>
          <Text style={[styles.cell, styles.headerCell]}>Points Required</Text>
        </View>

        {/* Table Rows */}
        <View style={styles.row}>
          <Text style={styles.cell}>
            Receive Notifications for in built specialization
          </Text>
          <Text style={styles.cell}>1 Point per notification</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Receive Keyword Notifications</Text>
          <Text style={styles.cell}>2 point per notification</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Save jobs to apply later</Text>
          <Text style={styles.cell}>3 points</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
});

export default RewardPointsScreen;

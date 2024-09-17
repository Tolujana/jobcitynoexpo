import React, {useState, useEffect} from 'react';
import {View, Text, Button, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';

// Subcategories and items
const categories = [
  {
    name: 'Engineering',
    subcategories: [
      'Chemical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
    ],
  },
  {
    name: 'Social Sciences',
    subcategories: ['Sociology', 'Economics', 'Mass Communication'],
  },
  {
    name: 'Information Technology',
    subcategories: ['Software Engineering', 'Cybersecurity', 'Data Science'],
  },
];

export default function CategorySelectionScreen() {
  const [selectedCategories, setSelectedCategories] = useState({});

  // Load saved selections when the screen is mounted
  useEffect(() => {
    const loadSelections = async () => {
      const storedCategories = await AsyncStorage.getItem('selectedCategories');
      if (storedCategories) {
        setSelectedCategories(JSON.parse(storedCategories));
      }
    };
    loadSelections();
  }, []);

  // Handle checkbox toggle
  const toggleSelection = (category, subcategory) => {
    setSelectedCategories(prevState => {
      const categorySelections = prevState[category] || [];
      const isSelected = categorySelections.includes(subcategory);

      if (isSelected) {
        // Remove from selection
        return {
          ...prevState,
          [category]: categorySelections.filter(item => item !== subcategory),
        };
      } else {
        // Add to selection
        return {
          ...prevState,
          [category]: [...categorySelections, subcategory],
        };
      }
    });
  };

  // Save selections to AsyncStorage
  const saveSelections = async () => {
    try {
      await AsyncStorage.setItem(
        'selectedCategories',
        JSON.stringify(selectedCategories),
      );
      alert('Selections saved!');
    } catch (error) {
      console.error('Error saving selections', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={item => item.name}
        renderItem={({item}) => (
          <View style={styles.category}>
            <Text style={styles.categoryHeader}>{item.name}</Text>
            {item.subcategories.map(subcategory => (
              <View key={subcategory} style={styles.subcategory}>
                <CheckBox
                  value={
                    selectedCategories[item.name]?.includes(subcategory) ||
                    false
                  }
                  onValueChange={() => toggleSelection(item.name, subcategory)}
                />
                <Text style={styles.subcategoryText}>{subcategory}</Text>
              </View>
            ))}
          </View>
        )}
      />
      <Button title="Save Selections" onPress={saveSelections} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  category: {
    marginBottom: 20,
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subcategory: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  subcategoryText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

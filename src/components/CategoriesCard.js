import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';

export default function CategoriesCard({
  category,
  activeCategory,
  onPress,
  index,
}) {
  const isActive = activeCategory?.name
    ? activeCategory.name === category.name
    : activeCategory?.search === category?.search;
  return (
    <TouchableOpacity
      className="p-2 m-1 px-4 rounded-full "
      style={{
        backgroundColor: isActive
          ? 'blue'
          : category.name
          ? '#EBEDEF'
          : '#ccd1d1',
      }}
      onPress={onPress}>
      <Text className={isActive ? 'text-white font-bold' : 'text-black'}>
        {category.name || category.search}
      </Text>
    </TouchableOpacity>
  );
}

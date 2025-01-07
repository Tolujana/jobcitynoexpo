import {Text, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import {ThemeContext} from '../theme/themeContext';

export default function CategoriesCard({
  category,
  activeCategory,
  onPress,
  index,
}) {
  const isActive = activeCategory?.name
    ? activeCategory.name === category.name
    : activeCategory?.search === category?.search;
  const theme = useContext(ThemeContext);
  const {primary, lightGrey, darkGrey} = theme.colors;

  return (
    <TouchableOpacity
      className="p-2 m-1 px-4 rounded-full "
      style={{
        backgroundColor: isActive
          ? primary
          : category.name
          ? lightGrey
          : darkGrey,
      }}
      onPress={onPress}>
      <Text className={isActive ? 'text-white font-bold' : 'text-black'}>
        {category.name || category.search}
      </Text>
    </TouchableOpacity>
  );
}

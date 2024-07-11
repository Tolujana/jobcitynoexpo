import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function NewCategoriesCard({ category, activeCategory, onPress, index }) {
  const isActive = activeCategory === index;
  return (
    <TouchableOpacity
      className="p-2 m-1 px-4 rounded-full "
      style={{ backgroundColor: isActive ? "blue" : "#EBEDEF" }}
      onPress={onPress}
    >
      <Text className={isActive ? "text-white font-bold" : "text-black"}>{category.title}</Text>
    </TouchableOpacity>
  );
}

import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { styles } from "../../assets/Styles";

import SingleJobEntry from "./SingleJobEntry";

const NewsSection = ({ label, newsProps, loadPost }) => {
  const navigation = useNavigation();
  const openItem = (item) => navigation.navigate("JobsDetails", item);

  const renderItem = ({ item, index }) => {
    return (index + 1) % 5 !== 0 ? (
      <SingleJobEntry item={item} index={index} onPress={openItem} />
    ) : (
      <View
        onChange={(inView) => {
          console.log("invew", inView);
          setIsLoadMore(inView);
        }}
      >
        <SingleJobEntry item={item} index={index} onPress={openItem} />
        <Text> advert</Text>
      </View>
    );
  };

  return (
    <View className="space-y-2 bg-white dark:bg-gray-800">
      <FlatList
        nestedScrollEnabled={true}
        scrollEnabled={false}
        showVerticalScrollIndicator={false}
        data={newsProps}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <Text>ADShere</Text>
    </View>
  );
};

export default NewsSection;

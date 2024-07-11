import { View, Text } from "react-native";
import React from "react";
import SingleJobEntry from "./SingleJobEntry";

const TansRenderItem = ({ item, index, data }) => {
  // const openItem = (item) => navigation.navigate("JobsDetails", item);
  return (index + 1) % 4 !== 0 ? (
    <SingleJobEntry item={item} index={index} data={data} />
  ) : (
    <View
      onChange={(inView) => {
        console.log("invew", inView);
        setIsLoadMore(inView);
      }}
    >
      <SingleJobEntry item={item} index={index} />
      <Text> advert</Text>
    </View>
  );
};

export default RenderItem;

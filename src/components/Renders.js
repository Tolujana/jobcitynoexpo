import { View, Text } from "react-native";
import React from "react";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
// const renderNativeAd = (nativeAd) => {
//   const { headline, body, callToAction, advertiser, icon } = nativeAd.nativeElements;

//   return (
//     <NativeAdView style={{ backgroundColor: "#f5f5f5", padding: 10, margin: 10 }}>
//       {icon && <MediaView style={{ width: 50, height: 50 }} source={{ uri: icon.uri }} />}
//       {headline && <Text style={{ fontSize: 16, fontWeight: "bold" }}>{headline}</Text>}
//       {body && <Text style={{ marginTop: 5 }}>{body}</Text>}
//       {callToAction && <Button title={callToAction} onPress={nativeAd.onPress} />}
//       {advertiser && <Text style={{ marginTop: 5, fontStyle: "italic" }}>{advertiser}</Text>}
//     </NativeAdView>
//   );
// };

export default function Renders() {
  const navigation = useNavigation();
  const openItem = (item) => navigation.navigate("JobsDetails", item);

  return (index + 1) % 4 !== 0 ? (
    <SingleJobEntry item={item} index={index} />
  ) : (
    <View
      onChange={(inView) => {
        console.log("invew", inView);
        setIsLoadMore(inView);
      }}
    >
      <SingleJobEntry item={item} index={index} />
      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}

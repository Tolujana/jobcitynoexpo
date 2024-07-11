import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  touchable: {
    fontFamily: "RobotoRegular",
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: "white",
    elevation: 2, // Android
    borderRadius: 7,
  },
});

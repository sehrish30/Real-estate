import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";

var { height, width } = Dimensions.get("screen");

const Loading = () => {
  return (
    <View
      style={{
        marginTop: height / 3,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#f8dc81" />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});

import React, { useState } from "react";
import {
  View,
  Dimensions,
  ActivityIndicator,
  PlatformColor,
} from "react-native";
import { Button, Overlay, Image } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

var { width, height } = Dimensions.get("window");

const SingleImageOverlay = ({
  toggleOverlay,
  showFullScreenImage,
  setVisible,
  visible,
}) => {
  return (
    <Overlay
      overlayStyle={{
        height: height,
        width: width,
        backgroundColor: "#fff",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
      backdropStyle={{ backgroundColor: "rgba(239, 247, 225, 0.4)" }}
      isVisible={visible}
      onBackdropPress={toggleOverlay}
    >
      <Ionicons
        style={{ marginLeft: "auto", marginRight: 10 }}
        name="close-circle-outline"
        color={"#214151"}
        size={30}
        onPress={toggleOverlay}
      />
      <Image
        source={{ uri: showFullScreenImage }}
        style={{ width: width, height: height / 1.5, resizeMode: "contain" }}
        PlaceholderContent={<ActivityIndicator />}
      />
    </Overlay>
  );
};

export default SingleImageOverlay;

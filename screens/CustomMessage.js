import React, { useState } from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import { Button, Overlay, Text } from "react-native-elements";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import Agree from "../Shared/Modals/Agree";

var { width, height } = Dimensions.get("window");
const CustomMessage = ({ heading, message, visible, setVisible, shortMsg }) => {
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <>
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={{
          paddingVertical: 20,
          width: width / 1.2,
          height: height / 2,
          backgroundColor: "#214151",
          borderRadius: 10,
        }}
      >
        <Ionicons
          style={{
            marginLeft: "auto",
            verticalAlign: "middle",
          }}
          name="md-close"
          color={"#839b97"}
          size={20}
          onPress={toggleOverlay}
        />

        <View style={{ margin: 20 }}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.headingModal}>{heading}</Text>
          </View>
        </View>
        <View style={{ margin: 20, alignItems: "center" }}>
          <FontAwesome5
            style={{
              marginRight: 8,
              verticalAlign: "middle",
            }}
            name="check-circle"
            color={"#98ded9"}
            size={60}
          />
        </View>
        <View style={{ alignItems: "center", textAlign: "center" }}>
          <Text style={styles.textInfo}>{shortMsg}</Text>
          <Text style={styles.textInfo}>{message}</Text>
        </View>
      </Overlay>
    </>
  );
};

export default CustomMessage;

const styles = StyleSheet.create({
  textInfo: {
    color: "#839b97",
    fontFamily: "EBGaramond-Regular",
    paddingTop: 5,
    textAlign: "center",
  },
  headingModal: {
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "EBGaramond-Regular",
    color: "#e4fbff",
  },
});

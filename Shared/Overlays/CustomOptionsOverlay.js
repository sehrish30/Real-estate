import React from "react";
import { Button, Overlay, Modal } from "react-native-elements";
import { Dimensions } from "react-native";
import FontIcon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

var { width, height } = Dimensions.get("screen");
const CustomOptionsOverlay = ({
  visible,
  toggleOverlay,
  changePassword,
  editAgency,
  showTiming,
  showVisitTimings,
}) => {
  return (
    <Overlay
      overlayStyle={{ width: width / 1.3 }}
      isVisible={visible}
      onBackdropPress={toggleOverlay}
      backdropStyle={{ backgroundColor: "rgba(239, 247, 225, 0.4)" }}
    >
      <Button
        onPress={() => {
          editAgency();
          toggleOverlay();
        }}
        type="outline"
        buttonStyle={{
          backgroundColor: "#fff",
          borderColor: "#214151",
          height: 50,
          marginVertical: 5,
        }}
        titleStyle={{
          color: "#214151",
        }}
        icon={
          <FontIcon
            style={{ marginRight: 15 }}
            name="pencil-square"
            color={"#214151"}
            size={25}
          />
        }
        title="Profile"
      />

      <Button
        onPress={() => {
          changePassword();
          toggleOverlay();
        }}
        type="outline"
        buttonStyle={{
          backgroundColor: "#fff",
          borderColor: "#214151",
          height: 50,
          marginVertical: 5,
        }}
        titleStyle={{
          color: "#214151",
        }}
        icon={
          <FontAwesome5
            style={{
              marginRight: 15,
            }}
            name="key"
            color={"#214151"}
            size={15}
          />
        }
        title="Password"
      />

      <Button
        onPress={() => {
          toggleOverlay();
          showTiming();
        }}
        type="outline"
        buttonStyle={{
          backgroundColor: "#fff",
          borderColor: "#214151",
          height: 50,
          marginVertical: 5,
        }}
        titleStyle={{
          color: "#214151",
        }}
        icon={
          <AntDesign
            style={{
              marginRight: 15,
            }}
            name="clockcircle"
            color={"#214151"}
            size={15}
          />
        }
        title="Office hours"
      />

      <Button
        onPress={() => {
          toggleOverlay();
          showVisitTimings();
        }}
        type="outline"
        buttonStyle={{
          backgroundColor: "#fff",
          borderColor: "#214151",
          height: 50,
          marginVertical: 5,
        }}
        titleStyle={{
          color: "#214151",
        }}
        icon={
          <MaterialCommunityIcons
            style={{
              marginRight: 15,
            }}
            name="map-clock"
            size={20}
            color={"#214151"}
          />
        }
        title="Property visit hours"
      />

      <Button
        onPress={toggleOverlay}
        title="Close"
        type="clear"
        titleStyle={{
          color: "#8dadb3",
        }}
        buttonStyle={{
          height: 50,
          marginVertical: 5,
        }}
      />
    </Overlay>
  );
};

export default CustomOptionsOverlay;

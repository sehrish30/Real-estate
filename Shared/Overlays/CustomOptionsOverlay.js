import React from "react";
import { Button, Overlay } from "react-native-elements";
import { Dimensions, Pressable } from "react-native";
import FontIcon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

var { width, height } = Dimensions.get("screen");
const CustomOptionsOverlay = ({
  visible,
  toggleOverlay,
  changePassword,
  editAgency,
}) => {
  return (
    <Overlay
      overlayStyle={{ width: width / 1.3 }}
      isVisible={visible}
      onBackdropPress={toggleOverlay}
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
            size={30}
          />
        }
        title="Edit Profile"
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
        title="Change Password"
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

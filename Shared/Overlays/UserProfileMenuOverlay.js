import React, { useState } from "react";
import { Button, Overlay } from "react-native-elements";
import { Dimensions } from "react-native";
import FontIcon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { changeUserPasswordSrv } from "../../Shared/Services/AuthServices";
import CustomModalPassword from "../Input/CustomModalPassword";

var { width, height } = Dimensions.get("screen");
const UserProfileMenuOverlay = ({
  visible,
  toggleOverlay,
  setShowPasswordModal,
  showPasswordModal,
}) => {
  return (
    <Overlay
      overlayStyle={{ width: width / 1.3, borderRadius: 10 }}
      isVisible={visible}
      onBackdropPress={toggleOverlay}
      backdropStyle={{ backgroundColor: "rgba(239, 247, 225, 0.4)" }}
    >
      <Button
        onPress={() => {
          //   changeUserPasswordSrv();
          setShowPasswordModal(true);
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

export default UserProfileMenuOverlay;

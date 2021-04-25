import React from "react";
import { BaseToast } from "react-native-toast-message";
export const toastConfig = {
  info: ({ text1, ...rest }) => (
    <BaseToast
      {...rest}
      style={{ borderLeftColor: "#1597bb" }}
      contentContainerStyle={{ paddingHorizontal: 1 }}
      leadingIcon={require("../assets/info-button.png")}
      leadingIconContainerStyle={{
        padding: 0,
        marginHorizontal: 0,
      }}
      leadingIconStyle={{
        width: 40,
        height: 25,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "semibold",
        fontFamily: "EBGaramond-Regular",
        color: "#214151",
      }}
      text2Style={{
        fontSize: 10,
        color: "#839b97",
      }}
      text1={text1}
      // text2={null}
    />
  ),
  success: ({ text1, ...rest }) => (
    <BaseToast
      {...rest}
      style={{ borderLeftColor: "#289672" }}
      contentContainerStyle={{ paddingHorizontal: 1 }}
      leadingIcon={require("../assets/checked.png")}
      leadingIconContainerStyle={{
        padding: 0,
        marginHorizontal: 0,
      }}
      leadingIconStyle={{
        width: 40,
        height: 25,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "semibold",
        fontFamily: "EBGaramond-Regular",
        color: "#214151",
      }}
      text2Style={{
        fontSize: 10,
        color: "#839b97",
      }}
      text1={text1}
      // text2={null}
    />
  ),
  success: ({ text1, ...rest }) => (
    <BaseToast
      {...rest}
      style={{ borderLeftColor: "#e02e49" }}
      contentContainerStyle={{ paddingHorizontal: 1 }}
      leadingIcon={require("../assets/remove.png")}
      leadingIconContainerStyle={{
        padding: 0,
        marginHorizontal: 0,
      }}
      leadingIconStyle={{
        width: 40,
        height: 25,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "semibold",
        fontFamily: "EBGaramond-Regular",
        color: "#214151",
      }}
      text2Style={{
        fontSize: 10,
        color: "#839b97",
      }}
      text1={text1}
      // text2={null}
    />
  ),
};

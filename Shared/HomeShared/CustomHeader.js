import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

const CustomHeader = ({ showMenu, title }) => {
  return (
    <Header
      containerStyle={{
        backgroundColor: "#eff7e1",
        justifyContent: "space-around",
      }}
      centerComponent={{ text: title, style: styles.headerTitle }}
      rightComponent={
        <TouchableOpacity>
          <Ionicons
            onPress={showMenu}
            name="menu"
            color={"#214151"}
            size={30}
            style={{ top: -5 }}
          />
        </TouchableOpacity>
      }
    />
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerTitle: {
    color: "#214151",
    fontFamily: "EBGaramond-Bold",
    fontSize: 16,
  },
});

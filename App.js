import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Main from "./Navigators/Main";
import Toast from "react-native-toast-message";

import DrawerNavigator from "./Navigators/DrawerNavigator";

export default function App() {
  return (
    <NavigationContainer>
      {/* <DrawerNavigator /> */}
      <Main />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "./screens/Register";
import Login from "./screens/Login";
import Forgot from "./screens/Forgot";
import Main from "./Navigators/Main";

import DrawerNavigator from "./Navigators/DrawerNavigator";

export default function App() {
  return (
    <NavigationContainer>
      {/* <DrawerNavigator /> */}
      <Main />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

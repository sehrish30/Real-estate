import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Forgot from "../screens/Forgot";

const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#2c6bed" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
  headerBackTitle: "Back",
};
function MyStack() {
  return (
    <Stack.Navigator
      // initialRouteName="Home"
      screenOptions={globalScreenOptions}
    >
      {/* <Stack.Screen
        options={{ title: "Log in" }}
        name="Login"
        component={Login}
      /> */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Forgot" component={Forgot} />
    </Stack.Navigator>
  );
}

export default function UserAuthNavigator() {
  return <MyStack />;
}

const styles = StyleSheet.create({});

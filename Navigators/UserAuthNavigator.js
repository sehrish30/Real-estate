import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/User/Login";
import Register from "../screens/User/Register";
import Forgot from "../screens/User/Forgot";
import AgencyLogin from "../screens/User/AgencyLogin";
import Profile from "../screens/User/Profile";

import { useSelector, useDispatch } from "react-redux";

const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#2c6bed" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
  headerBackTitle: "Back",
};

function MyStack() {
  let isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <Stack.Navigator
      // initialRouteName={token ? "Profile" : "Login"}
      screenOptions={globalScreenOptions}
    >
      {isLoggedIn ? (
        <Stack.Screen name="Profile" component={Profile} />
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: "Login" }}
          />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Forgot" component={Forgot} />
          <Stack.Screen name="AgencyLogin" component={AgencyLogin} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function UserAuthNavigator() {
  return <MyStack />;
}

const styles = StyleSheet.create({});

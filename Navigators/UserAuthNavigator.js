import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/User/Login";
import Register from "../screens/User/Register";
import Forgot from "../screens/User/Forgot";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Profile from "../screens/User/Profile";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { fillStore } from "../Redux/Actions/auth";
const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#2c6bed" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
  headerBackTitle: "Back",
};
function MyStack() {
  let isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getUser = async () => {
        try {
          let jwt = await AsyncStorage.getItem("jwt");
          let userData = await AsyncStorage.getItem("user");
          let user = userData ? JSON.parse(userData) : {};
          let isLoggedIn = !!(await AsyncStorage.getItem("jwt"));

          if (isLoggedIn) {
            dispatch(fillStore({ jwt, user, isLoggedIn }));
          }
        } catch (e) {
          console.error(e);
        }
      };
      if (isActive) {
        getUser();
      }

      return () => {
        isActive = false;
      };
    }, [])
  );

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
        </>
      )}
    </Stack.Navigator>
  );
}

export default function UserAuthNavigator() {
  return <MyStack />;
}

const styles = StyleSheet.create({});

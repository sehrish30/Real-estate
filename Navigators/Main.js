import React from "react";
import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import jwt_decode from "jwt-decode";
const Tab = createBottomTabNavigator();
import UserAuthNavigator from "./UserAuthNavigator";
import DrawerNavigator from "./DrawerNavigator";
import AdminNavigator from "./AdminNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
// import { StatusBar } from "expo-status-bar";

let showAdminPanel;
AsyncStorage.getItem("isLoggedInAgency").then((res) => {
  showAdminPanel = res;
});

const Main = () => {
  let token = useSelector((state) => state.auth.token);
  let decoded;
  if (token) {
    decoded = jwt_decode(token);
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        keyboardHidesTabBar: true,
        showLabel: false,
        activeTintColor: "#214151",
        inactiveTintColor: "#839b97",
      }}
    >
      {Platform.OS === "ios" && <StatusBar barStyle="light-content" />}

      <Tab.Screen
        name="Home"
        component={DrawerNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              name="home"
              style={{ position: "relative" }}
              color={color}
              size={30}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={UserAuthNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <View>
              <Icon name="wechat" color={color} size={25} />
              {/* <CartIcon /> */}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={UserAuthNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <View>
              <Icon name="search" color={color} size={25} />
            </View>
          ),
        }}
      />
      {decoded?.isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="shield-alt" color={color} size={25} />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="User"
        component={UserAuthNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="user" color={color} size={25} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;

const styles = StyleSheet.create({});

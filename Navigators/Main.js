import React from "react";
import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";

const Tab = createBottomTabNavigator();
import UserAuthNavigator from "./UserAuthNavigator";
import DrawerNavigator from "./DrawerNavigator";
// import { StatusBar } from "expo-status-bar";

const Main = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        keyboardHidesTabBar: true,
        showLabel: false,
        activeTintColor: "#214151",
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
              <Icon name="wechat" color={color} size={30} />
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
            <Icon name="search" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={UserAuthNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="user" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;

const styles = StyleSheet.create({});

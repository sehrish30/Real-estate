import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Requests from "../screens/Admin/Requests";
import Reports from "../screens/Admin/Reports";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Image } from "react-native-elements";
import SearchProperty from "../Shared/HomeShared/PostProperties/SearchProperty";

var { width, height } = Dimensions.get("window");

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="SearchProperty"
      tabBarOptions={{
        labelStyle: {
          fontSize: 12,
          fontFamily: "EBGaramond-Regular",
          marginTop: height / 14,
        },
        // tabStyle: { width: 100 },
        style: { backgroundColor: "#eff7e1" },
        activeTintColor: "#214151",
        inactiveTintColor: "#839b97",
        indicatorStyle: {
          backgroundColor: "#214151",
          borderRadius: 5,
        },
      }}
      showIcon={true}
    >
      <Tab.Screen
        name="SearchProperty"
        component={SearchProperty}
        lazy={true}
        options={{
          tabBarLabel: "Search Property",
        }}
      />
    </Tab.Navigator>
  );
}

export default function SearchNavigator() {
  return <MyTabs />;
}

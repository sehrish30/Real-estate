import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import SearchProperty from "../Shared/HomeShared/PostProperties/SearchProperty";

import FilterData from "../Shared/HomeShared/PostProperties/FilterData";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      headerMode="screen"
      //   screenOptions={{
      //     headerShown: false,
      //   }}
    >
      <Stack.Screen
        name="SearchProperty"
        component={SearchProperty}
        options={{
          title: "Search Property",
        }}
      />
      <Stack.Screen
        name="FilterData"
        component={FilterData}
        options={{
          title: "Results",
        }}
      />
    </Stack.Navigator>
  );
}

export default function SearchNavigator() {
  return <MyStack />;
}

const styles = StyleSheet.create({});

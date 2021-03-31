import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Drawer/Home";
import SearchAgency from "../screens/Drawer/SearchAgency";
import AgencyDetail from "../screens/Drawer/AgencyDetail";
import UserRateReview from "../screens/User/UserRateReview";

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
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SearchAgency"
        component={SearchAgency}
        options={{
          title: "Search Agency",
        }}
      />
      <Stack.Screen
        name="UserRateReview"
        component={UserRateReview}
        options={{
          title: "Rate and Review",
        }}
      />
      <Stack.Screen
        name="AgencyDetail"
        component={AgencyDetail}
        options={{
          title: "AgencyDetail",
        }}
      />
    </Stack.Navigator>
  );
}

export default function HomeNavigator() {
  return <MyStack />;
}

const styles = StyleSheet.create({});

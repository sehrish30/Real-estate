import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Drawer/Home";
import SearchAgency from "../screens/Drawer/SearchAgency";
import AgencyDetail from "../screens/Drawer/AgencyDetail";
import ScheduleConsultationForm from "../screens/Drawer/ScheduleConsultationForm";
import UserRateReview from "../screens/User/UserRateReview";
import Notifications from "../screens/Drawer/Notifications";
import MapLocations from "../screens/Drawer/MapLocations";
import SearchProperty from "../Shared/HomeShared/PostProperties/SearchProperty";
import PropertiesPosts from "../Shared/HomeShared/PostProperties/PropertiesPosts";

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
          title: "Agency Details",
        }}
      />
      <Stack.Screen
        name="ScheduleConsultationForm"
        component={ScheduleConsultationForm}
        options={{
          title: "Schedule consultation with agency",
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          title: "Notifications",
        }}
      />
      <Stack.Screen
        name="MapLocations"
        component={MapLocations}
        options={{
          title: "All properties",
        }}
      />
      <Stack.Screen
        name="SearchProperty"
        component={SearchProperty}
        options={{
          title: "Filter Property",
        }}
      />
      <Stack.Screen
        name="PropertiesPosts"
        component={PropertiesPosts}
        options={{
          title: "Property",
        }}
      />
    </Stack.Navigator>
  );
}

export default function HomeNavigator() {
  return <MyStack />;
}

const styles = StyleSheet.create({});

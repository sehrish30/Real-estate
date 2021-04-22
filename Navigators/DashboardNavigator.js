import React from "react";
import { StyleSheet, Text, View, Dimensions, StatusBar } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Dashboard from "../screens/Drawer/Dashboard";
import CustomHeader from "../Shared/HomeShared/CustomHeader";
const Tab = createMaterialTopTabNavigator();
import { useNavigation } from "@react-navigation/native";
import Statistics from "../screens/Drawer/Statistics";

var { height } = Dimensions.get("screen");
function MyTabs() {
  const navigation = useNavigation();
  const showMenu = () => {
    navigation.toggleDrawer();
  };
  return (
    <>
      <View style={{ marginTop: StatusBar.currentHeight / 2 || 0 }}>
        <CustomHeader title={"Dashboard"} showMenu={showMenu} />
      </View>

      <Tab.Navigator
        initialRouteName="Dashboard"
        tabBarOptions={{
          labelStyle: {
            fontSize: 12,
            fontFamily: "EBGaramond-Regular",
            // marginTop: height / 14,
          },

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
          lazy={true}
          name="Consultation Requests"
          component={Dashboard}
        />
        <Tab.Screen name="Statistics" component={Statistics} />
      </Tab.Navigator>
    </>
  );
}

export default function DashboardNavigator() {
  return <MyTabs />;
}

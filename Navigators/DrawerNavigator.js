import React from "react";

import Icon from "react-native-vector-icons/FontAwesome";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Forgot from "../screens/Forgot";
import { useWindowDimensions } from "react-native";
import Register from "../screens/Register";
import Login from "../screens/Login";
import AffordibilityCalculator from "../screens/Drawer/AffordibilityCalculator";
import RegisterAgent from "../screens/Drawer/RegisterAgent";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { width, height } = useWindowDimensions();
  return (
    <Drawer.Navigator
      initialRouteName="RegisterAgent"
      openByDefault={false}
      headerStatusBarHeight="20"
      drawerContentOptions={{
        activeTintColor: "#214151",
        itemStyle: { marginVertical: 5 },
      }}
      drawerStyle={{
        backgroundColor: "#a2d0c1",
        width: 240,
      }}
      drawerPosition="right"
      drawerType={width >= 768 ? "permanent" : "slide"}
    >
      <Drawer.Screen name="RegisterAgent" component={RegisterAgent} />
      <Drawer.Screen
        name="AffordibilityCalculator"
        component={AffordibilityCalculator}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

import React, { useCallback } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useWindowDimensions } from "react-native";

// imported Screens
import AffordibilityCalculator from "../screens/Drawer/AffordibilityCalculator";
import RegisterAgent from "../screens/Drawer/RegisterAgent";

import Home from "../screens/Drawer/Home";
import HomeNavigator from "./HomeNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { width } = useWindowDimensions();

  return (
    <Drawer.Navigator
      initialRouteName="MainView"
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
      <Drawer.Screen name="Home" component={HomeNavigator} />
      <Drawer.Screen name="Register Agency" component={RegisterAgent} />
      <Drawer.Screen
        name="Affordibility calculator"
        component={AffordibilityCalculator}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

import React, { useCallback } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useWindowDimensions } from "react-native";

// imported Screens
import AffordibilityCalculator from "../screens/Drawer/AffordibilityCalculator";
import RegisterAgent from "../screens/Drawer/RegisterAgent";

import { useSelector } from "react-redux";
import HomeNavigator from "./HomeNavigator";
import Dashboard from "../screens/Drawer/Dashboard";
import DashboardNavigator from "./DashboardNavigator";
import PropertiesInfo from "../Shared/HomeShared/PostProperties/PropertiesInfo";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { width } = useWindowDimensions();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isLoggedInAgency = useSelector((state) => state.auth.isLoggedInAgency);

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
        backgroundColor: "#fff",
        width: 240,
      }}
      drawerPosition="right"
      drawerType={width >= 768 ? "permanent" : "slide"}
    >
      <Drawer.Screen name="Home" component={HomeNavigator} />
      {(isLoggedInAgency || isLoggedIn) && (
        <Drawer.Screen name="Dashboard" component={DashboardNavigator} />
      )}

      <Drawer.Screen name="Register Seller" component={RegisterAgent} />
      {isLoggedIn && (
        <Drawer.Screen
          name="Affordibility calculator"
          component={AffordibilityCalculator}
        />
      )}
      {isLoggedInAgency && (
        <Drawer.Screen name="Post a property" component={PropertiesInfo} />
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

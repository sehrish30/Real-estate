import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useWindowDimensions } from "react-native";

// imported Screens
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

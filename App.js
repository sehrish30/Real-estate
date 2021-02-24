import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Main from "./Navigators/Main";
import Toast from "react-native-toast-message";
import store from "./Redux/store";
import { Provider } from "react-redux";

import DrawerNavigator from "./Navigators/DrawerNavigator";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        {/* <DrawerNavigator /> */}
        <Main />
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({});

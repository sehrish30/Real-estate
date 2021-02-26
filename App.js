import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Main from "./Navigators/Main";
import Toast from "react-native-toast-message";
import store from "./Redux/store";
import { Provider } from "react-redux";
import * as Font from "expo-font";
import { useFonts } from "expo-font";

import DrawerNavigator from "./Navigators/DrawerNavigator";

export default function App() {
  const [loaded] = useFonts({
    "EBGaramond-Bold": require("./assets/fonts/EBGaramond-ExtraBold.ttf"),
    "EBGaramond-Regular": require("./assets/fonts/EBGaramond-ExtraBold.ttf"),
    "EBGaramond-Italic": require("./assets/fonts/EBGaramond-Italic.ttf"),
  });

  if (!loaded) {
    return null;
  }
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

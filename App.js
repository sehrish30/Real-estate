import React, { useRef, useEffect } from "react";
import { StyleSheet, Text, View, Vibration } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Main from "./Navigators/Main";
import Toast from "react-native-toast-message";
import store from "./Redux/store";
import { Provider } from "react-redux";
import { useFonts } from "expo-font";
import { toastConfig } from "./Shared/config";
import * as Notification from "expo-notifications";
// import * as Notifications from "expo-notifications";
import { Notifications } from "expo";
// import { navigationRef } from "./app/navigation/rootNavigation";
export default function App() {
  const navigationRef = React.createRef();
  const responseListener = useRef();
  const notificationListener = useRef();

  const [loaded] = useFonts({
    "EBGaramond-Bold": require("./assets/fonts/EBGaramond-ExtraBold.ttf"),
    "EBGaramond-Regular": require("./assets/fonts/EBGaramond-Regular.ttf"),
    "EBGaramond-Italic": require("./assets/fonts/EBGaramond-Italic.ttf"),
  });

  Notification.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const handleNotification = (notification) => {
    Vibration.vibrate();
    // console.error("HANDLING", notification.data?.property);

    const { data } = notification;

    // A simple example of passing data as the value
    // of the screen you want the user to be navigated to
    // when they click on a notification
    // console.error("BACKEND", data, navigationRef.current?.getCurrentRoute());
    // console.error(data.property, !navigationRef.current?.getCurrentRoute());
    if (data?.property) {
      // navigationRef.current?.navigate("Notifications", data);
      // NEW
      (async function schedulePushNotification() {
        Notification.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
          }),
        });

        const indentifier = await Notification.scheduleNotificationAsync({
          content: {
            title: "ICONIC properties",
            body: "One of your subscribed location got new property ️‍🔥",
            data: data,
          },
          trigger: { seconds: 2 },
        });
        // await Notification.cancelScheduledNotificationAsync(indentifier);
      })();
      responseListener.current =
        Notification.addNotificationResponseReceivedListener((response) => {
          // console.error(
          //   "REALESTATE",
          //   response.notification.request.content.data,
          //   navigationRef.current?.getCurrentRoute()
          // );
          // ZAHRA
          // route you want to navigate to
          console.log("TRY---------------------------------", data);
          navigationRef.current?.navigate("PropertiesPosts", {
            id: data?.property,
          });
        });
    }
  };

  useEffect(() => {
    // notificationListener.current =
    //   Notification.addNotificationReceivedListener(handleNotification);

    // responseListener.current =
    //   Notification.addNotificationResponseReceivedListener(handleNotification);

    const subscribe = Notifications.addListener(handleNotification);
    return () => {
      subscribe.remove();
      // Notification.removeNotificationSubscription(notificationListener.current);
      // Notification.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        {/* <DrawerNavigator /> */}
        <Main />
        <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({});

import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AllChats from "../screens/Chats/AllChats";
import Chat from "../screens/Chats/Chat";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        headerShown: false,
        keyboardHandlingEnabled: true,
      }}
    >
      <Stack.Screen
        name="ChatMain"
        component={Chat}
        // options={{
        //   title: "Chat",
        // }}
      />
      <Stack.Screen
        name="AllChats"
        component={AllChats}
        // options={{
        //   title: "Chat",
        // }}
      />
    </Stack.Navigator>
  );
}

export default function ChatNavigator() {
  return <MyStack />;
}

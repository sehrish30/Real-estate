import React, { useEffect } from "react";
import { StyleSheet, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  unseenChatsAgency,
  unseenChatsCustomer,
} from "../../Shared/Services/ChatServices";

const ChatsNotification = () => {
  const notificationChats = useSelector(
    (state) => state.chat.notificationChats
  );

  useEffect(() => {
    let result;
  }, []);
  return (
    <>
      {notificationChats > 0 ? (
        <Image
          style={styles.badge}
          source={require("../../assets/notify.gif")}
        />
      ) : null}
    </>
  );
};

export default ChatsNotification;

const styles = StyleSheet.create({
  badge: {
    width: 20,
    height: 20,
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    top: -10,
    right: -8,
  },
  text: {
    fontSize: 12,
    width: 100,
    fontWeight: "bold",
  },
});

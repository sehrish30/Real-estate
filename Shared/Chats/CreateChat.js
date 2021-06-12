import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import * as actions from "../../Redux/Actions/chat";
import { Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { createChat } from "../../Shared/Services/ChatServices";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { CommonActions } from "@react-navigation/native";
import { StatusBar } from "react-native";
const CreateChat = ({
  data,
  searchAgency = false,
  navigation,
  message,
  dontshowBtn = false,
}) => {
  let token = useSelector((state) => state.auth.token);
  let user = useSelector((state) => state.auth.user);
  let agency = useSelector((state) => state.auth.agency);
  let socket = useSelector((state) => state.chat.socket);

  const createChatServiceCall = async () => {
    if (searchAgency) {
      // navigation.navigate("Home", {
      //   screen: "SearchAgency",
      // });
      navigation.navigate("SearchAgency");
    } else {
      if (Object.keys(socket).length <= 0) {
        Toast.show({
          type: "error",
          text1: `You are offline`,
          text2: `Be online by clicking on chat tab below`,
          visibilityTime: 2000,
          topOffset: StatusBar.currentHeight + 10,
        });
      } else {
        const res = await createChat(data, token);
        let info;
        if (res) {
          if (agency.id) {
            info = {
              id: res.id,
              agencyId: res.agency.id,
              name: res.customer.email,
              createdAt: res.createdAt,
              updatedAt: res.updatedAt,
              message: res?.chats[res.chats?.length - 1]?.content || null,
              uri: res.customer.dp,
              unSeenCount: 0,
              timesent: res?.chats[res.chats?.length - 1]?.timesent,
              customerId: res.customer.id,
              searchId: res.customer.id,
              seen: res?.chats[res.chats?.length - 1]?.seen || null,
              lastchatauthor: res?.chats[res.chats?.length - 1]?.author,
              type: res?.chats[res.chats?.length - 1]?.type,
              users: [
                {
                  id: res.customer.id,
                  online: false,
                },
                {
                  id: res.agency.id,
                  online: true,
                },
              ],
              new: true,
            };

            if (Object.keys(socket).length <= 0) {
              Toast.show({
                type: "error",
                text1: `Kindly visit your chats to activate it`,
                text2: `You are offline`,
                visibilityTime: 2000,
                topOffset: StatusBar.currentHeight + 10,
              });
            } else {
              socket.emit("newChat", {
                toUserId: res.customer.id,
                info: info,
                fromUserId: agency.id,
              });
            }

            // actions.addToFetchedChats(info);
          } else {
            info = {
              id: res.id,
              agencyId: res.agency.id,
              name: res.agency?.name,
              createdAt: res.createdAt,
              updatedAt: res.updatedAt,
              message: res?.chats[res.chats?.length - 1]?.content || null,
              uri: res.agency.logo.url,
              unSeenCount: 0,
              timesent: res?.chats[res.chats?.length - 1]?.timesent,
              customerId: res.customer.id,
              searchId: res.agency.id,
              seen: res?.chats[res.chats?.length - 1]?.seen || null,
              lastchatauthor: res?.chats[res.chats?.length - 1]?.author,
              type: res?.chats[res.chats?.length - 1]?.type,
              users: [
                {
                  id: res.customer.id,
                  online: true,
                },
                {
                  id: res.agency.id,
                  online: false,
                },
              ],
              new: true,
            };

            socket?.emit("newChat", {
              toUserId: res.agency.id,
              info: info,
              fromUserId: user.decoded.userId,
            });

            actions.addToFetchedChats(info);
          }
        }

        navigation.reset({
          routes: [{ name: "AllChats" }],
        });
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          textAlign: "center",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "EBGaramond-Bold",
            color: "#214151",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          {message}
        </Text>
      </View>

      <View style={styles.bg}>
        <Image
          style={styles.stretch}
          source={require("../../assets/begin-chat.png")}
          alt="bg"
        />
      </View>

      {!dontshowBtn && (
        <Button
          onPress={createChatServiceCall}
          buttonStyle={{ backgroundColor: "#f8dc81" }}
          titleStyle={{ color: "#214151", fontFamily: "EBGaramond-Regular" }}
          icon={
            <Ionicons
              style={{ marginRight: 10 }}
              name="ios-chatbox-ellipses"
              size={15}
              color="#214151"
            />
          }
          title="Let's start"
        />
      )}
    </View>
  );
};

export default CreateChat;

const styles = StyleSheet.create({
  stretch: {
    width: 200,
    height: 150,
    marginBottom: 5,
  },
  bg: {
    display: "flex",
    margin: "auto",
    alignItems: "center",
    marginBottom: 30,
  },
});

import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, EvilIcons } from "@expo/vector-icons";
import { Badge } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { deleteChat } from "../../Shared/Services/ChatServices";
import { Image } from "react-native-elements";

import chat from "../../Redux/Reducers/chat";
const ChatHeader = ({
  showTrash,
  toggleOverlay,
  setShowTrash,
  deleteMessageReceiever,
  otherChatName,
  mainIndex,
  deluser,
  chatId,
  setMainIndex,
}) => {
  let senderTyping = useSelector((state) => state.chat.senderTyping);
  let user = useSelector((state) => state.auth.user);
  let agency = useSelector((state) => state.auth.agency);
  let token = useSelector((state) => state.auth.token);
  let chats = useSelector((state) => state.chat.chats);

  let userId;
  if (agency.id) {
    userId = agency.id;
  } else {
    userId = user.decoded.userId;
  }

  return (
    <View style={styles.header}>
      {showTrash ? (
        <View
          style={{
            marginLeft: "auto",
            marginRight: 25,
            flexDirection: "row",
          }}
        >
          <EvilIcons
            style={{ marginRight: 10 }}
            name="trash"
            size={30}
            color="#214151"
            onPress={() => {
              if (deluser == userId) {
                deleteChat(mainIndex, chatId, token);
                deleteMessageReceiever(mainIndex);
              }
            }}
          />
          <EvilIcons
            name="close"
            size={30}
            color="#214151"
            onPress={() => {
              setShowTrash(!showTrash);
              setMainIndex("");
            }}
          />
        </View>
      ) : (
        <>
          <View style={{ marginLeft: "auto" }}>
            <Text style={styles.name}>
              {/* {chats.map((chat) => {
                chat.users.map((onlineperson) => {
                  onlineperson.id == userId && (
                    <Badge
                      status="success"
                      containerStyle={{ marginLeft: 5 }}
                    />
                  );
                });
              })} */}
              {otherChatName.name}{" "}
              {/* {otherChatName?.id && (
                <Badge status="success" containerStyle={{ marginLeft: 10 }} />
              )}{" "} */}
              {senderTyping.id === userId && senderTyping.typing && (
                <Image
                  style={{
                    width: 40,
                    height: 10,
                    paddingLeft: 10,
                  }}
                  containerStyle={{
                    padding: 0,
                    marginTop: 20,
                  }}
                  source={require("../../assets/typing.gif")}
                />
                // <Text style={{ paddingLeft: 10, color: "#839b97" }}>....</Text>
              )}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "flex-end",
              marginLeft: "auto",
              marginRight: 10,
            }}
          >
            <MaterialCommunityIcons
              onPress={toggleOverlay}
              name="dots-vertical"
              size={26}
              color="#8dadb3"
            />
          </View>
        </>
      )}
    </View>
  );
};

export default memo(ChatHeader);

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#98ded9",
    paddingTop: 25,
    paddingBottom: 15,
    alignItems: "center",
    flexDirection: "row",
    // justifyContent: "center",
  },
  name: {
    fontFamily: "EBGaramond-Bold",
    fontSize: 16,
    color: "#214151",
  },
});

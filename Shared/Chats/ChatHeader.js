import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, EvilIcons } from "@expo/vector-icons";
import { Badge } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";

const ChatHeader = ({
  showTrash,
  toggleOverlay,
  setShowTrash,
  deleteMessageReceiever,
  otherChatName,
}) => {
  let senderTyping = useSelector((state) => state.chat.senderTyping);
  let user = useSelector((state) => state.auth.user);
  let agency = useSelector((state) => state.auth.agency);

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
              deleteMessageReceiever(mainIndex);
            }}
          />
          <EvilIcons
            name="close"
            size={30}
            color="#214151"
            onPress={() => setShowTrash(!showTrash)}
          />
        </View>
      ) : (
        <>
          <View style={{ marginLeft: "auto" }}>
            <Text style={styles.name}>
              {otherChatName.name}
              {otherChatName.id && (
                <Badge status="success" containerStyle={{ marginLeft: 5 }} />
              )}{" "}
              {senderTyping.id === userId && senderTyping.typing && (
                <Text style={{ marginLeft: 10, color: "grey" }}>....</Text>
              )}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "flex-end",
              marginLeft: "auto",
              marginRight: 5,
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

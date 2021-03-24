import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ListItem, Avatar, Badge } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../Redux/Actions/chat";
// import TouchableScale from "react-native-touchable-scale";

const ChatsCard = ({
  name,
  uri,
  id,
  message,
  navigation,
  createdAt,
  unSeenCount,
  agencyId,
  customerId,
}) => {
  let dispatch = useDispatch();
  const [showBadge, setShowBadge] = useState(false);

  let newmsgchats = useSelector((state) => state.chat.newMessageChats);
  let senderTyping = useSelector((state) => state.chat.senderTyping);
  const [newmsg, setNewMsg] = useState([]);

  return (
    <View style={styles.card}>
      <ListItem
        onPress={() => {
          navigation.navigate("ChatMain", {
            agency: agencyId,
            customer: customerId,
          });
          dispatch(actions.currentChat(id));
        }}
        key={id}
        bottomDivider
        // Component={TouchableScale}
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95} //
        linearGradientProps={{
          colors: ["#a2d0c1", "#e4fbff"],
          start: { x: 1, y: 0 },
          end: { x: 0.7, y: 2 },
        }}
        ViewComponent={LinearGradient}
      >
        <Avatar source={{ uri }} />
        <ListItem.Content>
          <ListItem.Title
            style={{ color: "#214151", fontFamily: "EBGaramond-Bold" }}
          >
            {name}
          </ListItem.Title>
          <ListItem.Subtitle style={{ color: "#214151" }}>
            {message}
          </ListItem.Subtitle>
        </ListItem.Content>
        <View>
          {newmsgchats.chatId == id && (
            <Badge
              value="New"
              badgeStyle={{
                backgroundColor: "#f8dc81",
                paddingVertical: 10,
              }}
              containerStyle={{
                borderRadius: 100,
              }}
              textStyle={{ color: "#214151" }}
            />
          )}

          <Text style={{ fontSize: 8, marginTop: 5, color: "#839b97" }}>
            {createdAt}
          </Text>
        </View>
        <ListItem.Chevron color="white" />
      </ListItem>
    </View>
  );
};

export default ChatsCard;

const styles = StyleSheet.create({});

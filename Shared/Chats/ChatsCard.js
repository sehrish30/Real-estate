import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { ListItem, Avatar, Badge } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

// import TouchableScale from "react-native-touchable-scale";
var { height, width } = Dimensions.get("screen");
const ChatsCard = ({
  name,
  uri,
  id,
  message,
  navigation,
  createdAt,
  agencyId,
  customerId,
  seen,
  lastchatauthor,
  unseencount,
  timesent,
  type,
  unSeenCount,
}) => {
  let newmsgchats = useSelector((state) => state.chat.newMessageChats);

  let userId;
  let user = useSelector((state) => state.auth.user);
  let agency = useSelector((state) => state.auth.agency);
  if (agency.id) {
    userId = agency.id;
  } else {
    userId = user.decoded.userId;
  }

  // useFocusEffect(
  //   React.useCallback(() => {
  //     return () => {
  //       setUnseencount(
  //         unseencount.filter((count) => {
  //           return count.id != id;
  //         })
  //       );
  //     };
  // //   }, [unseencount, setUnseencount])
  // );

  return (
    <View style={styles.card}>
      <ListItem
        onPress={() => {
          navigation.navigate("ChatMain", {
            agency: agencyId,
            customer: customerId,
            chatId: id,
            notsure: false,
          });
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
        <Avatar rounded source={{ uri }} />
        <ListItem.Content>
          <ListItem.Title
            style={{ color: "#214151", fontFamily: "EBGaramond-Bold" }}
          >
            {name}
          </ListItem.Title>
          <ListItem.Subtitle style={{ color: "#214151" }}>
            {type === "image" ? (
              <Ionicons name="image-outline" size={17} color="#8dadb3" />
            ) : message.length > 25 ? (
              <Text>{message.substr(0, 25)}...</Text>
            ) : (
              message
            )}
          </ListItem.Subtitle>
        </ListItem.Content>
        <View>
          {newmsgchats.chatId == id && !newmsgchats.seen ? (
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
          ) : (
            <>
              <View>
                {lastchatauthor != userId && !seen && unSeenCount > 0 && (
                  <Badge
                    value={unSeenCount}
                    badgeStyle={{
                      backgroundColor: "#f8dc81",
                      // paddingVertical: 10,
                    }}
                    containerStyle={{
                      borderRadius: 100,
                    }}
                    textStyle={{ color: "#214151" }}
                  />
                )}
              </View>
            </>
          )}

          <Text style={{ fontSize: 9, marginTop: 5, color: "#839b97" }}>
            {timesent ? formatDistanceToNow(Date.parse(timesent)) : createdAt}
          </Text>
        </View>
        <ListItem.Chevron color="white" />
      </ListItem>
    </View>
  );
};

export default ChatsCard;

const styles = StyleSheet.create({});

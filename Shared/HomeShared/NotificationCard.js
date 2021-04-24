import React, { useState, useReducer, useEffect } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { Avatar, ListItem, Badge, Overlay } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
// import TouchableScale from "react-native-touchable-scale";
import NotificationsOverlay from "../Overlays/NotificationsOverlay";
import { formatISO9075, formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import { getAllNotificationDetails } from "../../Shared/Services/NotificationServices";
const reducer = (state, newState) => ({ ...state, ...newState });
const initialState = {
  details: {},
};

const NotificationCard = ({
  id,
  navigation,
  content,
  author,
  dp,
  time,
  isSeen,
}) => {
  const [visible, setVisible] = useState(false);
  const [{ details }, dispatch] = useReducer(reducer, initialState);

  let token = useSelector((state) => state.auth.token);
  const toggleOverlay = () => {
    (async () => {
      const data = await getAllNotificationDetails(id, token);
      if (data) {
        dispatch({ details: data });
        setVisible(!visible);
      }
    })();
  };

  return (
    <View style={[styles.card]}>
      <ListItem
        //   key={id}
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
        onPress={() => {
          toggleOverlay();
        }}
        ViewComponent={LinearGradient}
      >
        <Avatar rounded source={{ uri: dp }} />
        <ListItem.Content>
          <ListItem.Title style={{ color: "#214151", fontSize: 14 }}>
            <Text
              style={{
                fontFamily: "EBGaramond-Bold",
                marginRight: 10,
                fontSize: 16,
              }}
            >
              {author}{" "}
            </Text>

            {content}
          </ListItem.Title>
          <ListItem.Subtitle
            style={{ color: "#839b97", fontSize: 10, marginTop: 5 }}
          >
            {formatDistanceToNow(Date.parse(time), { includeSeconds: true })}
          </ListItem.Subtitle>
        </ListItem.Content>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {!isSeen && (
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
        </View>

        {/* <ListItem.Chevron color="white" /> */}
      </ListItem>
      {visible && (
        <NotificationsOverlay
          navigation={navigation}
          visible={visible}
          toggleOverlay={toggleOverlay}
          details={details}
        />
      )}
    </View>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({});

import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { Avatar, ListItem, Badge, Overlay } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import TouchableScale from "react-native-touchable-scale";
import NotificationsOverlay from "../Overlays/NotificationsOverlay";

const NotificationCard = ({ notificationContent, author, dp, time }) => {
  const [visible, setVisible] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  return (
    <View style={styles.card}>
      <ListItem
        //   key={id}
        bottomDivider
        Component={TouchableScale}
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
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
          }).start();
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

            {notificationContent}
          </ListItem.Title>
          <ListItem.Subtitle
            style={{ color: "#839b97", fontSize: 10, marginTop: 5 }}
          >
            {time}
          </ListItem.Subtitle>
        </ListItem.Content>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
        </View>

        {/* <ListItem.Chevron color="white" /> */}
      </ListItem>
      <NotificationsOverlay visible={visible} toggleOverlay={toggleOverlay} />
    </View>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({});

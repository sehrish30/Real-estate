import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  Animated,
} from "react-native";
import { Avatar, Overlay, Card, Button } from "react-native-elements";
import { Entypo, Fontisto } from "@expo/vector-icons";

var { width, height } = Dimensions.get("screen");

const NotificationsOverlay = ({ visible, toggleOverlay, navigation }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  return (
    <View>
      <Overlay
        overlayStyle={{ width: width, height: height }}
        backdropStyle={{ backgroundColor: "rgba(239, 247, 225, 0.4)" }}
        isVisible={visible}
        onBackdropPress={toggleOverlay}
      >
        <Fontisto
          style={{ marginLeft: "auto", marginRight: 5, marginTop: 20 }}
          name="close"
          color={"#214151"}
          size={25}
          onPress={toggleOverlay}
        />

        <Animated.View
          style={{
            transform: [
              // {
              //   rotateY: animatedValue.interpolate({
              //     inputRange: [0, 0.5, 1],
              //     outputRange: ["0deg", "-90deg", "-180deg"],
              //   }),
              // },
              // {
              //   scale: animatedValue.interpolate({
              //     inputRange: [0, 0.5, 1],
              //     outputRange: [1, 2, 1],
              //   }),
              // },
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 10, 0],
                }),
              },
              {
                perspective: 400,
              },
            ],
          }}
        >
          <Card containerStyle={styles.details}>
            <Card.Title>Request Details</Card.Title>
            <Card.Divider />

            <View style={styles.user}>
              <Avatar
                size="medium"
                rounded
                source={{
                  uri:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fZ_ebLrIR7-37WMGcyj_RO-0TTcZGtUKtg&usqp=CAU",
                }}
              />
              <View>
                <Text style={styles.name}>{"sehrishwaheed98@gmail.com"}</Text>
                <Text style={styles.name}>{"3585225"}</Text>
              </View>
            </View>

            <View style={styles.timeSection}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                  <Fontisto
                    style={{ marginRight: 5 }}
                    name="date"
                    color={"#839b97"}
                    size={20}
                    onPress={toggleOverlay}
                  />

                  <Text
                    style={[
                      styles.font,
                      { marginVertical: "auto", color: "#214151" },
                    ]}
                  >
                    23/19/2020
                  </Text>
                </View>

                <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                  <Entypo
                    style={{ marginRight: 5 }}
                    name="time-slot"
                    color={"#839b97"}
                    size={20}
                    onPress={toggleOverlay}
                  />
                  <Text style={{ color: "#214151" }}>
                    <Text style={styles.font}> 8:00</Text> AM to
                    <Text style={styles.font}> 9:00 </Text>
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.message}>
              Lorem Epsuum Lorem Epsuum Lorem Epsuum Lorem Epsuum Lorem Epsuum
              Lorem Epsuum Lorem Epsuum Lorem Epsuum Lorem Epsuum Lorem Epsuum
              Lorem Epsuum Lorem Epsuum
            </Text>

            <View style={styles.type}>
              <Fontisto
                style={{ marginRight: 5 }}
                name="persons"
                color={"#2c6e8f"}
                size={20}
                onPress={toggleOverlay}
              />
              <Text
                style={[
                  styles.font,
                  {
                    color: "#2c6e8f",
                    fontSize: 16,
                  },
                ]}
              >
                Wants to meet in person
              </Text>
            </View>
            <View style={styles.cta}>
              <Button
                onPress={() => {
                  Alert.alert(
                    "Decline Request",
                    "Are you sure you want to decline schedule request?",
                    [
                      {
                        text: "Decline",
                        style: "cancel",
                        onPress: () => console.log("OK Pressed"),
                      },
                      {
                        text: "Nope",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "default",
                      },
                    ]
                  );
                }}
                titleStyle={{ color: "#839b97" }}
                type="clear"
                buttonStyle={[styles.btn, styles.declinebtn]}
                title="Decline"
              />
              <Button
                titleStyle={{ color: "#214151" }}
                buttonStyle={[styles.btn, styles.acceptbtn]}
                title="Accept"
                onPress={() => {
                  Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                  }).start(() => {
                    toggleOverlay();
                  });
                }}
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <Button
                buttonStyle={{ borderColor: "#214151" }}
                titleStyle={{
                  color: "#214151",
                  fontFamily: "EBGaramond-Regular",
                  fontSize: 18,
                }}
                title="Want to reschedule?"
                type="outline"
                // onPress={() => {
                //   setShowDetails(false);
                //   Animated.timing(showReschdule, {
                //     toValue: 1,
                //     duration: 1000,
                //     useNativeDriver: true,
                //   }).start(() => {
                //     // toggleOverlay();
                //   });
                // }}
                onPress={() => {
                  toggleOverlay();
                  navigation.navigate("ScheduleConsultationForm", {
                    email: "sehrishwaheed98@gmail.com",
                    phoneNumber: "36522522",
                  });
                }}
              />
            </View>
          </Card>
        </Animated.View>
      </Overlay>
    </View>
  );
};

export default NotificationsOverlay;

const styles = StyleSheet.create({
  details: {
    backgroundColor: "#e4fbff",
    borderRadius: 5,
  },
  image: {
    height: 20,
    width: 10,
  },
  user: {
    flexDirection: "row",
  },
  name: {
    marginLeft: 10,
    color: "#214151",
    marginTop: 5,
  },
  timeSection: {
    marginVertical: 20,
    // alignItems: "center",
  },
  font: { fontFamily: "EBGaramond-Bold" },
  message: {
    color: "#214151",
  },
  type: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  btn: {
    marginTop: 10,
    width: width / 2.7,
  },
  cta: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  acceptbtn: {
    backgroundColor: "#f8dc81",
  },
});
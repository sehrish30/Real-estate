import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Animated,
} from "react-native";
import { Overlay, Button, Avatar } from "react-native-elements";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import DeleteConfirm from "../Modals/DeleteConfirm";
import { useSelector } from "react-redux";

let { width, height } = Dimensions.get("screen");
const DashboardOverlay = ({
  visible,
  toggleOverlay,
  consultationType,
  dp,
  phoneNumber,
  payment,
  customerMessage,
  agencyMessage,
  timesent,
  animatedValue,
  setModalVisible,
  status,
}) => {
  let agency = useSelector((state) => state.auth.agency);
  return (
    <Overlay
      overlayStyle={{ width: width, borderRadius: 10 }}
      isVisible={visible}
      onBackdropPress={toggleOverlay}
      backdropStyle={{ backgroundColor: "rgba(239, 247, 225, 0.4)" }}
    >
      <Animated.ScrollView
        style={{
          transform: [
            {
              rotateY: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: ["340deg", "350deg", "360deg"],
              }),
            },
            {
              perspective: 400,
            },
          ],
        }}
      >
        <View>
          <Ionicons
            style={{ marginLeft: "auto" }}
            name="close-circle-outline"
            color={"#214151"}
            size={30}
            onPress={() => {
              toggleOverlay();
            }}
          />
        </View>
        <View>
          <View style={styles.header}>
            <Text style={styles.heading}>{consultationType}</Text>
          </View>
          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              // width: width / 1.3,
            }}
          >
            <Avatar
              // style={{ alignItems: "center" }}
              rounded
              source={{
                uri: dp,
              }}
            />
            <View style={{ width: width / 1.1 }}>
              <Text ellipsizeMode="tail" numberOfLines={2} style={styles.email}>
                sehrishwaheed98@gmail.com
              </Text>
            </View>
          </View>
          <View
            style={{
              marginVertical: 30,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              // backgroundColor: "blue",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <FontAwesome5
                name="phone-alt"
                size={15}
                color="#839b97"
                style={{ paddingRight: 10 }}
              />
              <Text
                style={{ color: "#214151", fontFamily: "EBGaramond-Regular" }}
              >
                {phoneNumber}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <FontAwesome5
                name="money-check-alt"
                size={15}
                color="#839b97"
                style={{ paddingRight: 10 }}
              />
              <Text
                style={{ color: "#214151", fontFamily: "EBGaramond-Regular" }}
              >
                {payment}
              </Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 5 }}>
            {customerMessage && (
              <>
                <Text style={styles.message}>Customer's Message</Text>
                <Text style={{ color: "#214151" }}>{customerMessage}</Text>
              </>
            )}
            {agencyMessage && (
              <>
                <Text style={[styles.message, { marginTop: 10 }]}>
                  Agency's Response
                </Text>
                <Text style={{ color: "#214151" }}>{agencyMessage}</Text>
              </>
            )}
          </View>
          <View style={styles.timesent}>
            <Text style={styles.time}>{timesent}</Text>
          </View>
        </View>
        {agency?.id && status == "pending" && (
          <>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 20,
                justifyContent: "center",
              }}
            >
              <Button
                titleStyle={[styles.font, { color: "#e02e49" }]}
                containerStyle={styles.solidbtn}
                title="Decline"
                type="clear"
                onPress={() => {
                  setModalVisible(true);
                }}
                buttonStyle={styles.decline}
              />
              <Button
                titleStyle={styles.font}
                raised={true}
                buttonStyle={styles.accept}
                containerStyle={styles.clrbtn}
                title="Accept"
              />
            </View>
            <Button
              titleStyle={[styles.font, { color: "#214151" }]}
              title="Request to reschedule"
              type="clear"
            />
          </>
        )}
      </Animated.ScrollView>
    </Overlay>
  );
};

export default DashboardOverlay;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "EBGaramond-Bold",
    fontSize: 14,
  },
  header: {
    alignItems: "center",
  },
  email: {
    justifyContent: "center",
    width: width / 2,
    marginLeft: 30,
    color: "#214151",
  },
  message: { color: "#214151", fontFamily: "EBGaramond-Bold" },
  timesent: { marginTop: 20, alignItems: "center" },
  time: {
    fontFamily: "EBGaramond-Bold",
    color: "#839b97",
  },
  solidbtn: {
    width: width / 2,
  },
  clrbtn: {
    width: width / 2,
  },
  accept: {
    backgroundColor: "#214151",
  },
  font: {
    fontFamily: "EBGaramond-Bold",
  },
});

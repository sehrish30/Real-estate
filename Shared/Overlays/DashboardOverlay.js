import React from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import { Overlay, Card, Avatar } from "react-native-elements";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

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
}) => {
  return (
    <Overlay
      overlayStyle={{ width: width, borderRadius: 10 }}
      isVisible={visible}
      onBackdropPress={toggleOverlay}
      backdropStyle={{ backgroundColor: "rgba(239, 247, 225, 0.4)" }}
    >
      <ScrollView>
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
      </ScrollView>
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
});

import React, { useState, useRef } from "react";
import { StyleSheet, Dimensions, View, Animated } from "react-native";
import { ListItem, Tooltip, Text } from "react-native-elements";
// import TouchableScale from "react-native-touchable-scale";
import { LinearGradient } from "expo-linear-gradient";

import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
  Ionicons,
  EvilIcons,
} from "@expo/vector-icons";
import DashboardOverlay from "../Overlays/DashboardOverlay";
import DeleteConfirm from "../Modals/DeleteConfirm";

var { width, height } = Dimensions.get("screen");
const DashboardList = ({
  title,
  date,
  startTime,
  endTime,
  status,
  consultationType,
  dp,
  phoneNumber,
  payment,
  customerMessage,
  agencyMessage,
  timesent,
  consultationId,
  customer,
  agencyId,
  agencyName,
}) => {
  const [visible, setVisible] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  // console.error(customer, agencyId, agencyName, consultationId, "ID");

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <ListItem
      onPress={() => {
        toggleOverlay();
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          });
        });
      }}
      bottomDivider
      //   Component={TouchableScale}
      friction={90} //
      tension={100} // These props are passed to the parent component (here TouchableScale)
      activeScale={0.95} //
      linearGradientProps={{
        colors: ["#fff", "#63C3F2"],
        start: { x: 0, y: 1 },
        end: { x: 1, y: 10 },
      }}
      ViewComponent={LinearGradient}
      bottomDivider
      containerStyle={styles.listContainer}
    >
      <ListItem.Content style={styles.list}>
        <View style={{ flexDirection: "row", width: width / 1.1 }}>
          <ListItem.Title style={styles.titleName}>{title}</ListItem.Title>
          <View style={{ marginLeft: "auto" }}>
            <Tooltip
              overlayColor="rgba(239, 247, 225, 0.4)"
              backgroundColor="#f8dc81"
              containerStyle={styles.tooltip}
              popover={<Text style={styles.popoverText}>{status}</Text>}
            >
              {status == "pending" && (
                <MaterialIcons
                  name="pending-actions"
                  size={25}
                  color="#214151"
                />
              )}
              {status == "declined" && (
                <MaterialIcons name="event-busy" size={25} color="#214151" />
              )}

              {status == "accepted" && (
                <MaterialCommunityIcons
                  name="progress-check"
                  size={25}
                  color="#214151"
                />
              )}

              {status == "reschedule" && (
                <Feather name="loader" size={25} color="#214151" />
              )}

              {status == "paid" && (
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={25}
                  color="#214151"
                />
              )}
              {status == "done" && (
                <Ionicons
                  name="ios-checkmark-done-circle-outline"
                  size={25}
                  color="#214151"
                />
              )}
            </Tooltip>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 10,
            paddingHorizontal: 10,

            borderColor: "#214151",
          }}
        >
          <ListItem.Subtitle style={styles.date}>
            <Ionicons
              name="ios-calendar"
              size={15}
              color="#839b97"
              style={{ marginRight: 5, marginTop: 5 }}
            />
            {/* {date
              ? formatISO9075(Date.parse(date), { representation: "date" })
              : null} */}
            {date}
          </ListItem.Subtitle>
          <ListItem.Subtitle style={[styles.date, { marginLeft: 20 }]}>
            <MaterialCommunityIcons
              name="clock-time-three"
              size={15}
              color="#839b97"
              style={{ marginRight: 5 }}
            />
            {/* {startTime
              ? formatISO9075(Date.parse(startTime), {
                  representation: "time",
                }).slice(0, 5)
              : null}{" "}
            {parseInt(startTime.slice(0, 2)) / 12 >= 1 ? "pm" : "am"} -
            {endTime
              ? formatISO9075(Date.parse(endTime), {
                  representation: "time",
                }).slice(0, 5)
              : null}{" "}
            {parseInt(endTime.slice(0, 2)) / 12 >= 1 ? "pm" : "am"} */}
            {startTime} - {endTime}
          </ListItem.Subtitle>
        </View>
      </ListItem.Content>
      <DashboardOverlay
        consultationType={consultationType}
        dp={dp}
        phoneNumber={phoneNumber}
        payment={payment}
        customerMessage={customerMessage}
        agencyMessage={agencyMessage}
        timesent={timesent}
        toggleOverlay={toggleOverlay}
        visible={visible}
        animatedValue={animatedValue}
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
      />
      <DeleteConfirm
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        consultationId={consultationId}
        customer={customer}
        agencyId={agencyId}
        agencyName={agencyName}
      />
    </ListItem>
  );
};

export default DashboardList;

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingBottom: 0,
  },
  list: {
    margin: 5,
  },
  titleName: {
    fontFamily: "EBGaramond-Bold",
    color: "#214151",
    fontSize: 16,
  },
  popoverText: {
    fontFamily: "EBGaramond-Bold",
    color: "#214151",
  },
  date: {
    color: "#214151",
    fontSize: 14,
    alignItems: "center",
    width: width / 2.5,
  },
});

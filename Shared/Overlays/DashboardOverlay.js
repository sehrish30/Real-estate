import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { Overlay, Button, Avatar, Platform } from "react-native-elements";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { markPayedConsultation } from "../../Shared/Services/NotificationServices";
import { useSelector, useDispatch } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import * as notifyActions from "../../Redux/Actions/consultation";
import Agree from "../Modals/Agree";
import { deleteConsultationService } from "../../Shared/Services/NotificationServices";
let { width, height } = Dimensions.get("screen");

const DashboardOverlay = ({
  consultationId,
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
  deleteConsultation,
  setPriceVisible,
  navigation,
  title,
  customer,
  agencyId,
  agencyName,
  mainIndex,
  setMainIndex,
  officeTimingEnd,
  officeTimingStart,
}) => {
  let agency = useSelector((state) => state.auth.agency);
  let token = useSelector((state) => state.auth.token);
  let socket = useSelector((state) => state.chat.socket);
  let consultations = useSelector((state) => state.consultation.consultations);
  let dispatch = useDispatch();

  const deleteAction = async () => {
    const res = await deleteConsultationService(
      consultationId,
      agencyId,
      customer,
      token
    );
    if (res) {
      setModalVisibleConfirm(false);
      toggleOverlay();
      setMainIndex(consultationId);

      Animated.timing(deleteConsultation, {
        toValue: { x: 500, y: -100 },
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        dispatch(notifyActions.deleteConsultation({ id: consultationId }));
        LayoutAnimation.spring();
        Animated.timing(deleteConsultation, {
          toValue: { x: 0, y: 0 },
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          LayoutAnimation.spring();
          setMainIndex("");
        });
      });

      socket.emit("deleteConsultation", {
        agencyId,
        id: consultationId,
      });
    }
  };

  const [modalVisibleConfirm, setModalVisibleConfirm] = useState(false);
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
              onPress={() => {
                toggleOverlay();

                navigation.navigate("Chat", {
                  screen: "ChatMain",
                  params: {
                    agency: agencyId,
                    customer,
                    notsure: true,
                  },
                });
              }}
              rounded
              source={{
                uri: dp,
              }}
            />
            <View style={{ width: width / 1.1 }}>
              <Text ellipsizeMode="tail" numberOfLines={2} style={styles.email}>
                {title}
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
            {customerMessage ? (
              <>
                <Text style={styles.message}>Customer's Message</Text>
                <Text style={{ color: "#214151" }}>{customerMessage}</Text>
              </>
            ) : null}
            {agencyMessage ? (
              <>
                <Text style={[styles.message, { marginTop: 10 }]}>
                  Agency's Response
                </Text>
                <Text style={{ color: "#214151" }}>{agencyMessage}</Text>
              </>
            ) : null}
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
                onPress={() => {
                  setPriceVisible(true);
                }}
              />
            </View>
            <Button
              titleStyle={[styles.font, { color: "#214151" }]}
              title="Request to reschedule"
              type="clear"
              onPress={() => {
                toggleOverlay();
                navigation.navigate("ScheduleConsultationForm", {
                  email: title,
                  phoneNumber: phoneNumber,
                  customerId: customer,
                  consultationId: consultationId,
                  startTiming: officeTimingEnd,
                  endTiming: officeTimingStart,
                });
              }}
            />
          </>
        )}
        {agency?.id && status == "accepted" && (
          <Button
            icon={
              <AntDesign
                name="checkcircleo"
                style={{ marginRight: 15 }}
                size={15}
                color="#e4fbff"
              />
            }
            titleStyle={styles.font}
            raised={true}
            buttonStyle={styles.accept}
            containerStyle={styles.acceptbtn}
            title="Mark as paid"
            onPress={async () => {
              const res = await markPayedConsultation(
                { agencyId, agencyName, customer, id: consultationId },
                token
              );
              toggleOverlay();
              if (res) {
                socket.emit("notification", {
                  ...res.notification,
                  customer,
                });

                dispatch(
                  notifyActions.updateConsultations({
                    id: consultationId,
                    status: "paid",
                  })
                );
              }
            }}
          />
        )}

        {status == "reschedule" && !agency?.id && (
          <Button
            titleStyle={styles.font}
            raised={true}
            buttonStyle={styles.accept}
            containerStyle={styles.acceptbtn}
            title="Reschedule"
            onPress={() => {
              toggleOverlay();
              navigation.navigate("AgencyDetail", {
                id: agencyId,
              });
            }}
          />
        )}
        {status == "pending" && !agency?.id && (
          <Button
            type="clear"
            icon={<FontAwesome5 name="trash" size={15} color="#D65A50" />}
            titleStyle={styles.font}
            raised={true}
            // buttonStyle={styles.accept}
            containerStyle={{ marginLeft: "auto" }}
            onPress={async () => {
              setModalVisibleConfirm(true);
            }}
          />
        )}
      </Animated.ScrollView>
      <Agree
        modalVisible={modalVisibleConfirm}
        setModalVisible={setModalVisibleConfirm}
        msg="Are you sure you want to delete this consultation request?"
        cancelbtn="Yes, delete"
        yesbtn="Nope"
        deleteAction={deleteAction}
      />
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
  acceptbtn: {
    marginTop: 20,
  },
});

import React, { useLayoutEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import NotificationCard from "../../Shared/HomeShared/NotificationCard";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllCustomerNotifications,
  getAllAgencyNotifications,
  setAllNotificationsSeenAgency,
  setAllNotificationsSeenCustomer,
} from "../../Shared/Services/NotificationServices";
import * as notificationsActions from "../../Redux/Actions/consultation";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "react-native-elements";
import Loading from "../../Shared/Loading";

const Item = ({ content }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{content}</Text>
  </View>
);

const Notifications = ({ navigation }) => {
  let dispatch = useDispatch();
  let token = useSelector((state) => state.auth.token);
  let userId;
  let agency = useSelector((state) => state.auth.agency);
  let user = useSelector((state) => state.auth.user);
  let DATA = useSelector((state) => state.consultation.notifications);
  console.log("LENGTH IS", DATA);

  const renderItem = ({ item }) => (
    <NotificationCard
      id={item.id}
      author={item.agency.name || item.customer.email}
      content={item.content}
      dp={item.agency.logo?.url || item.customer.dp}
      time={item.timesent}
      navigation={navigation}
      isSeen={item.isSeen}
    />
  );
  //   <Item title={item.title} />;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
    });
    let notifications;
    (async () => {
      console.log("LENGTH", DATA.length);

      if (agency.id) {
        notifications = await getAllAgencyNotifications(agency.id, token);

        dispatch(notificationsActions.storeAllNotifications(notifications));
      } else {
        notifications = await getAllCustomerNotifications(
          user.decoded.userId,
          token
        );
        dispatch(notificationsActions.storeAllNotifications(notifications));
      }
      dispatch(notificationsActions.seenAllNotifications());
    })();
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      if (agency.id) {
        (async () =>
          await setAllNotificationsSeenAgency({ userId: agency.id }, token))();
      } else {
        (async () =>
          await setAllNotificationsSeenCustomer(
            {
              userId: user.decoded.userId,
            },
            token
          ))();
      }
    }, [])
  );
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {DATA.length > 0 ? (
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.no}>
          <Image
            source={require("../../assets/notifications.png")}
            style={{ width: 300, height: 300 }}
            PlaceholderContent={<Loading />}
          />
          <Text style={styles.notification}>No Notifications</Text>
        </View>
      )}
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  notification: {
    fontFamily: "EBGaramond-Bold",
    color: "#214151",
    fontSize: 18,
  },
  no: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

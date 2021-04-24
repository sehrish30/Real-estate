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

// const DATA = [
//   {
//     id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
//     content: "wants to meet you in person",
//     author: "testing@gmail.com",
//     time: "5:06PM",
//     dp:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fZ_ebLrIR7-37WMGcyj_RO-0TTcZGtUKtg&usqp=CAU",
//   },
//   {
//     id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
//     content: "has requested you to reschedule the request details to",
//     author: "sehrishwaheed@gmail.com",
//     time: "2 days ago",
//     dp:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fZ_ebLrIR7-37WMGcyj_RO-0TTcZGtUKtg&usqp=CAU",
//   },
//   {
//     id: "58694a0f-3da1-471f-bd96-145571e29d72",
//     content: "has accepted your consultation request",
//     author: "ali@gmail.com",
//     time: "Just now",
//     dp:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fZ_ebLrIR7-37WMGcyj_RO-0TTcZGtUKtg&usqp=CAU",
//   },
// ];

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
    <View>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({});

import React, { useLayoutEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import NotificationCard from "../../Shared/HomeShared/NotificationCard";
const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    notificationContent: "wants to meet you in person",
    author: "testing@gmail.com",
    time: "5:06PM",
    dp:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fZ_ebLrIR7-37WMGcyj_RO-0TTcZGtUKtg&usqp=CAU",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    notificationContent:
      "has requested you to reschedule the request details to",
    author: "sehrishwaheed@gmail.com",
    time: "2 days ago",
    dp:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fZ_ebLrIR7-37WMGcyj_RO-0TTcZGtUKtg&usqp=CAU",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    notificationContent: "has accepted your consultation request",
    author: "ali@gmail.com",
    time: "Just now",
    dp:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fZ_ebLrIR7-37WMGcyj_RO-0TTcZGtUKtg&usqp=CAU",
  },
];

const Item = ({ notificationContent }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{notificationContent}</Text>
  </View>
);

const Notifications = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <NotificationCard
      author={item.author}
      notificationContent={item.notificationContent}
      dp={item.dp}
      time={item.time}
    />
  );
  //   <Item title={item.title} />;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
    });

    return () => {};
  }, [navigation]);
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

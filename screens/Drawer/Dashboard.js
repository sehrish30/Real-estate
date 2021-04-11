import React, { useLayoutEffect, useState } from "react";

import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StatusBar,
  RefreshControl,
} from "react-native";

import DashboardList from "../../Shared/HomeShared/DashboardList";
import CustomHeader from "../../Shared/HomeShared/CustomHeader";

var { width, height } = Dimensions.get("screen");

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
    date: "23/15/2006",
    startTime: "12:00AM",
    endTime: "1:00AM",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
    date: "23/15/2006",
    startTime: "12:00AM",
    endTime: "1:00AM",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
    date: "23/15/2006",
    startTime: "12:00AM",
    endTime: "1:00AM",
  },
];

const Item = ({ title, date, startTime, endTime }) => (
  <DashboardList
    title={title}
    date={date}
    startTime={startTime}
    endTime={endTime}
  />
);

const Dashboard = ({ navigation }) => {
  // States
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
    });

    return () => {};
  }, [navigation]);

  // Toggle drawer
  const showMenu = () => {
    navigation.toggleDrawer();
  };

  // Refresh FlatList
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const renderItem = ({ item }) => (
    <Item
      title={item.title}
      date={item.date}
      startTime={item.startTime}
      endTime={item.endTime}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
      <CustomHeader title={"Dashboard"} showMenu={showMenu} />
      <FlatList
        refreshControl={
          <RefreshControl
            tintColor="#214151"
            refreshing={refreshing}
            onRefresh={onRefresh}
            title="Refresh"
            titleColor="#214151"
          />
        }
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});

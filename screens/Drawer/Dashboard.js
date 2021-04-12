import React, { useLayoutEffect, useState, useReducer } from "react";

import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StatusBar,
  RefreshControl,
} from "react-native";
import { formatISO9075, formatDistanceToNow } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import {
  agencyConsultations,
  userConsultations,
} from "../../Shared/Services/NotificationServices";
import * as consultationActions from "../../Redux/Actions/consultation";

import DashboardList from "../../Shared/HomeShared/DashboardList";
import CustomHeader from "../../Shared/HomeShared/CustomHeader";

const reducer = (state, newState) => ({ ...state, ...newState });
const initialState = {
  consultation: {},
  consultationId: "",
};
var { width, height } = Dimensions.get("screen");

const Item = ({
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
}) => (
  <DashboardList
    title={title}
    date={date}
    startTime={startTime}
    endTime={endTime}
    status={status}
    consultationType={consultationType}
    dp={dp}
    phoneNumber={phoneNumber}
    payment={payment}
    customerMessage={customerMessage}
    agencyMessage={agencyMessage}
    timesent={
      timesent
        ? formatDistanceToNow(Date.parse(timesent), { addSuffix: true })
        : null
    }
  />
);

const Dashboard = ({ navigation }) => {
  // States
  const [refreshing, setRefreshing] = useState(false);
  let token = useSelector((state) => state.auth.token);
  let userId;
  let user = useSelector((state) => state.auth.user);
  let agency = useSelector((state) => state.auth.agency);
  if (agency.id) {
    userId = agency.id;
  } else {
    userId = user?.decoded?.userId;
  }

  const consultationsStored = useSelector(
    (state) => state.consultation.consultations
  );
  // REDUCERS
  const [{ consultations, consultationId }, dispatchConsultation] = useReducer(
    reducer,
    initialState
  );
  let dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      if (agency.id) {
        (async () => {
          let res = await agencyConsultations(userId, token);
          if (res) {
            dispatchConsultation({
              consultations: res.consultations,
              consultationId: res.id,
            });
            dispatch(
              consultationActions.storeAllConsultations({
                consultations: res.consultations,
                consultationId: res.id,
              })
            );
          }
        })();
      } else {
        (async () => {
          let res = await userConsultations(userId, token);
          if (res) {
            dispatchConsultation({
              consultations: res.consultations,
              consultationId: res.id,
            });
            dispatch(
              consultationActions.storeAllConsultations({
                consultations: res.consultations,
                consultationId: res.id,
              })
            );
          }
        })();
      }
      return () => {
        dispatchConsultation({
          consultations: {},
          consultationId: null,
        });
      };
    }, [refreshing])
  );

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
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  const renderItem = ({ item }) => {
    if (agency.id) {
      item.title = item.customer.email;
    } else {
      item.title = item.agency?.name;
    }
    item.consultationType = "";
    if (item.isVirtual) {
      item.consultationType = "Virtual Consultation";
      item.dp = item.customer.dp;
    } else {
      item.consultationType = "In person Consultation";
      item.dp = item.agency?.logo.url;
    }
    return (
      <Item
        title={item.title}
        date={item.date}
        startTime={item.startTime}
        endTime={item.endTime}
        status={item.status}
        consultationType={item.consultationType}
        dp={item.dp}
        phoneNumber={item.phoneNumber}
        payment={item?.payment || 0}
        customerMessage={item.message}
        agencyMessage={item.rescdheuleMessage || null}
        timesent={item.timesent}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
        data={consultationsStored.consultations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#fff",
  },
});

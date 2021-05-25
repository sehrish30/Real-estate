import React, { useCallback, useEffect, useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fillStore } from "../../Redux/Actions/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native";
import { Header } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import socketIOClient from "socket.io-client";
import baseURL from "../../assets/common/baseUrl";
import { Badge } from "react-native-elements";
import { showNotifications } from "../../Shared/Services/NotificationServices";
import * as notificationConsultation from "../../Redux/Actions/consultation";
import Icon from "react-native-vector-icons/Ionicons";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";
import { FontAwesome5 } from "@expo/vector-icons";
import * as actionsChats from "../../Redux/Actions/chat";
import { getAgencyDetails } from "../../Shared/Services/AgencyServices";
import {
  unseenChatsAgency,
  unseenChatsCustomer,
} from "../../Shared/Services/ChatServices";

// import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";

import Splash from "../Splash";
import { Pressable } from "react-native";
import { useSocket } from "../../hooks/socketConnect";
import Landing from "../../Shared/HomeShared/Landing";
import HomeMenu from "./HomeMenu";

const Home = ({ navigation, route }) => {
  let [bootSplashIsVisible, setBootSplashIsVisible] = useState(true);
  const [countBell, setCountBell] = useState(true);
  const [category, setCategory] = useState("Done");
  const token = useSelector((state) => state.auth.token);
  const showNewNotification = useSelector((state) => state.consultation.new);
  const tokenAvailable = useSelector((state) => state.auth.token);

  /*--------------------------------------
             ENDPOINT
  --------------------------------------- */
  const ENDPOINT = baseURL;
  const socket = socketIOClient(ENDPOINT);

  const dispatch = useDispatch();
  const showMenu = () => {
    navigation.toggleDrawer();
  };

  useFocusEffect(
    useCallback(() => {
      const checkTokenValidity = async () => {
        const token = await AsyncStorage.getItem("jwt");
        if (token) {
          const decoded = jwt_decode(token);
          if (Date.now() >= decoded.exp * 1000) {
            AsyncStorage.clear();
          }
        }
      };
      checkTokenValidity();
    })
  );

  useFocusEffect(
    useCallback(() => {
      const time = setTimeout(function () {
        setBootSplashIsVisible(false);

        NetInfo.fetch().then((state) => {
          if (!state.isConnected) {
            Toast.show({
              position: "bottom",
              type: "info",
              text1: `No internet connection available`,
              text2: `Swipe down to remove it`,
              autoHide: false,
              topOffset: 100,
            });
          }
        });
      }, 4000);

      return () => {
        clearTimeout(time);
      };
    }, [bootSplashIsVisible])
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getUser = async () => {
        try {
          let jwt = await AsyncStorage.getItem("jwt");
          let userData = await AsyncStorage.getItem("user");
          let user = userData ? JSON.parse(userData) : {};
          let isLoggedIn = !!(
            (await AsyncStorage.getItem("isLoggedIn")) == "true"
          );
          let agencyData = await AsyncStorage.getItem("agency");

          let agency = agencyData ? JSON.parse(agencyData) : {};
          let data;
          let newAgency = {};
          (async () => {
            data = await getAgencyDetails(agency.id);
            newAgency = {
              id: data._id,
              name: data.name,
              email: data.email,
              phoneNumber: data.phoneNumber,
              logo: data.logo,
              location: data.location,
              bio: data.bio,
              commercial: data.commercial,
              residential: data.residential,
              industrial: data.residential,
              land: data.land,
              officeTimingStart: data.officeTimingStart,
              officeTimingEnd: data.officeTimingEnd,
              isVerified: data.isVerified,
            };
            console.error("DATA", data);
          })();
          let isLoggedInAgency = !!(
            (await AsyncStorage.getItem("isLoggedInAgency")) == "true"
          );

          if (isLoggedIn || isLoggedInAgency) {
            dispatch(
              fillStore({ jwt, user, isLoggedIn, isLoggedInAgency, agency })
            );

            useSocket({ user: user.decoded ? user : agency }, dispatch);

            (async () => {
              if (agency.id) {
                let data = await showNotifications(agency.id, tokenAvailable);

                if (data > 0) {
                  dispatch(notificationConsultation.requestConsultation());
                }
              } else {
                let data = await showNotifications(user.decoded.userId, jwt);

                if (data > 0) {
                  dispatch(notificationConsultation.requestConsultation());
                }
              }
            })();
          }

          // Check to show notifications
          let userId;

          if (agency.id) {
            userId = agency.id;
          } else {
            userId = user.decoded.userId;
          }

          // notify new chats
          let getToken = await AsyncStorage.getItem("jwt");
          let result;

          if (countBell) {
            setCountBell(false);
            if (user.decoded && getToken) {
              (async () => {
                result = await unseenChatsCustomer(
                  user.decoded.userId,
                  getToken
                );
                dispatch(actionsChats.sendChatNotifications(result));
              })();
            } else if (agency.id && getToken) {
              (async () => {
                result = await unseenChatsAgency(agency.id, getToken);
                dispatch(actionsChats.sendChatNotifications(result));
              })();
            }
          }
        } catch (e) {
          console.error(e);
        }
      };
      if (isActive) {
        getUser();
      }

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {}
      {bootSplashIsVisible ? (
        <Splash bootSplashIsVisible={bootSplashIsVisible} />
      ) : (
        <>
          {category !== "Done" ? (
            <Header
              containerStyle={{
                backgroundColor: "#eff7e1",
                justifyContent: "space-around",
              }}
              leftComponent={
                <View style={styles.rightNav}>
                  {tokenAvailable ? (
                    <TouchableOpacity style={styles.menu} onPress={showMenu}>
                      <Icon
                        name="notifications"
                        color={"#214151"}
                        size={30}
                        onPress={() => {
                          navigation.navigate("Notifications");
                        }}
                      />
                      {showNewNotification && (
                        <Badge
                          badgeStyle={{
                            marginLeft: 10,
                            top: -33,
                          }}
                          status="warning"
                        />
                      )}
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    style={styles.menu}
                    onPress={() => {
                      navigation.navigate("SearchAgency");
                    }}
                  >
                    <MaterialIcons
                      name="person-search"
                      color={"#214151"}
                      size={30}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.menu}
                    onPress={() => {
                      navigation.navigate("MapLocations");
                    }}
                  >
                    <FontAwesome5
                      name="map-marked"
                      style={{ marginTop: 5 }}
                      color={"#214151"}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
              }
              rightComponent={
                <TouchableOpacity style={styles.menu}>
                  <Icon
                    onPress={showMenu}
                    name="menu"
                    color={"#214151"}
                    size={30}
                  />
                </TouchableOpacity>
              }
            />
          ) : null}

          {category === "Done" ? (
            <HomeMenu setCategory={setCategory} />
          ) : (
            <Landing
              refresh={route.params?.deleteProperty}
              category={category}
              setCategory={setCategory}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rightNav: {
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "space-between",
  },
  menu: {
    paddingTop: 25,
    paddingRight: 20,
  },
});

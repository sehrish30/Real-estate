import React, { useCallback, useEffect, useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fillStore } from "../../Redux/Actions/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { SafeAreaView } from "react-native";
import { Header } from "react-native-elements";

import Icon from "react-native-vector-icons/Ionicons";

// import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";

import Splash from "../Splash";
import { Pressable } from "react-native";

const Home = ({ navigation }) => {
  let [bootSplashIsVisible, setBootSplashIsVisible] = useState(false);

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
          let isLoggedInAgency = !!(
            (await AsyncStorage.getItem("isLoggedInAgency")) == "true"
          );
          if (isLoggedIn || isLoggedInAgency) {
            dispatch(
              fillStore({ jwt, user, isLoggedIn, isLoggedInAgency, agency })
            );
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
      {bootSplashIsVisible ? (
        <Splash bootSplashIsVisible={bootSplashIsVisible} />
      ) : (
        <Header
          containerStyle={{
            backgroundColor: "#eff7e1",
            justifyContent: "space-around",
          }}
          leftComponent={
            <View style={styles.rightNav}>
              <TouchableOpacity style={styles.menu} onPress={showMenu}>
                <Icon name="notifications" color={"#214151"} size={30} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menu}
                onPress={() => {
                  navigation.navigate("SearchAgency");
                }}
              >
                <Icon name="ios-search" color={"#214151"} size={30} />
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

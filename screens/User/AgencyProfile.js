import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Card } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import AntIcon from "react-native-vector-icons/AntDesign";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../Redux/Actions/auth";

const AgencyProfile = ({ navigation }) => {
  // States
  const [user, setUser] = useState("");
  const dispatch = useDispatch();

  // Actions
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("jwt");
      await AsyncStorage.removeItem("agency");
      dispatch(logoutUser());
      navigation.navigate("Home");
    } catch (e) {
      console.error(e);
    }
  };

  // Side Effects
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#a2d0c1" },
      headerTintColor: "#a2d0c1",
      title: "Account",
      headerRight: () => (
        <TouchableOpacity onPress={logout}>
          <AntIcon
            style={{ verticalAlign: "middle", marginRight: 15 }}
            name="logout"
            color={"#a2d0c1"}
            size={30}
          />
        </TouchableOpacity>
      ),
    });

    const getAgency = async () => {
      try {
        const data = await AsyncStorage.getItem("agency");
        const parsedData = JSON.parse(data);
        setUser(parsedData.email);
      } catch (e) {
        console.log(e);
      }
    };
    getAgency();
  }, [navigation, logout]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card containerStyle={styles.bg}>
        <Card.Title style={styles.font}>
          <Icon
            style={{ verticalAlign: "middle", marginRight: 5 }}
            name="user-circle-o"
            color={"#a2d0c1"}
            size={30}
          />
          <Text style={styles.font}>{user}</Text>
        </Card.Title>
        <Card.Divider />
      </Card>
    </ScrollView>
  );
};

export default AgencyProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eff7e1",
  },
  font: {
    fontFamily: "EBGaramond-Regular",
    color: "#214151",
  },
  text: {
    color: "#214151",
  },
  bg: {
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(162, 208, 193, 0.6)",
  },
});

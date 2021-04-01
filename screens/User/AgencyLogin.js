import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Form from "../../Shared/Input/Form";
import { SafeAreaView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { loginAgencySrv } from "../../Shared/Services/AuthServices";
import { useDispatch } from "react-redux";
import * as actions from "../../Redux/Actions/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AgencyLogin = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const loginAgency = async () => {
    setLoading(true);
    let newEmail = email;
    newEmail = newEmail.toLowerCase().trim();

    const res = await loginAgencySrv({ email: newEmail, password }, navigation);
    console.log(res);
    if (res) {
      const {
        id,
        name,
        email,
        phoneNumber,
        logo,
        location,
        bio,
        commercial,
        residential,
        industrial,
        land,
      } = res.data.agency;
      const agency = {
        id,
        name,
        email,
        phoneNumber,
        logo,
        location,
        bio,
        commercial,
        residential,
        industrial,
        land,
      };

      // navigation.replace("Home");

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });

      // Store information in local Storage
      await AsyncStorage.setItem("jwt", res.data.token);
      await AsyncStorage.setItem("agency", JSON.stringify(agency));
      await AsyncStorage.setItem("isLoggedInAgency", "true");
      // Storing informatiom in redux
      dispatch(
        actions.loginAgencyAction({
          agency,
          token: res.data.token,
          isLoggedInAgency: true,
        })
      );
      setLoading(false);
    } else {
      console.log("ELSE");
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
      headerTitle: "Login agency",
    });
  }, [navigation]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.bg}>
          <Image
            style={styles.stretch}
            source={require("../../assets/login.png")}
            alt="bg"
          />
        </View>

        <Form
          email={email}
          password={password}
          loading={loading}
          setEmail={setEmail}
          setPassword={setPassword}
          name={"Login"}
          navigation={navigation}
          btnAction={loginAgency}
        />
        <Text
          style={styles.extra}
          onPress={() => navigation.navigate("Forgot", { agencyForgot: true })}
        >
          Forgot Password
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AgencyLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    display: "flex",
    margin: "auto",
    alignItems: "center",
  },
  stretch: {
    width: 200,
    height: 180,
  },
  extra: {
    color: "#214151",
    textAlign: "center",
    fontSize: 14,
    fontFamily: "EBGaramond-Regular",
  },
});

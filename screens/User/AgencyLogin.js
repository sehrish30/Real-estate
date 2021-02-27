import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Form from "../../Shared/Input/Form";
import { SafeAreaView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { loginAgencySrv } from "../../Shared/Services/AuthServices";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import * as actions from "../../Redux/Actions/auth";

const AgencyLogin = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const loginAgency = async () => {
    setLoading(true);
    const res = await loginAgencySrv({ email, password }, navigation);
    console.log(res);
    const { id, name, email, phoneNumber, logo, location } = res.data.agency;
    dispatch(
      actions.loginAgencyAction({
        agency: { id, name, email, phoneNumber, logo, location },
        token: res.data.token,
        isLoggedInAgency: true,
      })
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#a2d0c1" },
      headerTintColor: "#a2d0c1",
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
    width: 100,
    height: 100,
  },
});

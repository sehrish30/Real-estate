import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Form from "../../Shared/Input/Form";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../Redux/Actions/auth";
import { ScrollView } from "react-native-gesture-handler";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#a2d0c1" },
      headerTintColor: "#a2d0c1",
    });
  }, [navigation]);

  function LoginUser() {
    setLoading(true);
    // loginUser({ email, password });
    dispatch(
      actions.login({ email: email.toLowerCase(), password }, navigation)
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.bg}>
          <Image
            style={styles.stretch}
            source={require("../../assets/login.png")}
            alt="bg"
          />
        </View>

        <Text style={[styles.font, styles.heading]}>Welcome back!</Text>
        <Form
          email={email}
          password={password}
          loading={loading}
          setEmail={setEmail}
          setPassword={setPassword}
          name={"Login"}
          extra={"Don't have an account? Register"}
          navigation={navigation}
          btnAction={LoginUser}
        />
        <Text
          style={styles.extra}
          onPress={() => navigation.navigate("Forgot")}
        >
          Forgot Password
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  stretch: {
    width: 100,
    height: 100,
  },
  bg: {
    display: "flex",
    margin: "auto",
    alignItems: "center",
  },

  font: {
    fontFamily: "EBGaramond-Regular",
  },
  heading: {
    textAlign: "center",
    fontSize: 25,
    color: "#214151",
    marginBottom: 12,
    marginTop: 5,
  },
  extra: {
    color: "#214151",
    marginVertical: 12,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "EBGaramond-Regular",
  },
});

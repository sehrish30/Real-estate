import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Button } from "react-native-elements";
import Form from "../Shared/Input/Form";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1", fontWeight: "bold" },
      headerTitleStyle: { color: "#214151" },
      headerTintColor: "#214151",
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <View style={styles.bg}>
        <Image
          style={styles.stretch}
          source={require("../assets/login.png")}
          alt="bg"
        />
      </View>

      <Text style={[styles.font, styles.heading]}>Welcome back!</Text>
      <Form
        email={email}
        password={password}
        loading={loading}
        setEmail={setEmail}
        password={setPassword}
        name={"Login"}
        extra={"Don't have an account? Register"}
        navigation={navigation}
      />
      <Text style={styles.extra} onPress={() => navigation.navigate("Forgot")}>
        Forgot Password
      </Text>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  stretch: {
    width: 350,
    height: 270,
  },
  bg: {
    display: "flex",
    margin: "auto",
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

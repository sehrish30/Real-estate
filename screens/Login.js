import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Button } from "react-native-elements";

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
    <View>
      <View style={styles.bg}>
        <Image
          style={styles.stretch}
          source={require("../assets/login.png")}
          alt="bg"
        />
      </View>

      <SafeAreaView style={styles.form}>
        <Text style={[styles.font, styles.heading]}>Welcome back!</Text>
        <Input
          rightIcon={{
            type: "font-awesome",
            name: "envelope",
            color: "#f8dc81",
          }}
          style={styles.input}
          onChangeText={(value) => setEmail(value)}
          label="Email"
        />
        <Input
          rightIcon={{ type: "font-awesome", name: "key", color: "#f8dc81" }}
          style={styles}
          onChangeText={(value) => setPassword(value)}
          label="Password"
        />
        <Button
          buttonStyle={styles.register}
          raised
          title="Login"
          loading={loading}
        />
        <Text
          style={styles.extra}
          onPress={() => navigation.navigate("Register")}
        >
          Don't have an account? Register
        </Text>
        <Text
          style={styles.extra}
          onPress={() => navigation.navigate("Forgot")}
        >
          Forgot Password
        </Text>
      </SafeAreaView>
    </View>
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
  form: {
    marginHorizontal: "auto",
    marginTop: 15,
  },
  font: {
    fontFamily: "EBGaramond-Regular",
  },
  heading: {
    textAlign: "center",
    fontSize: 25,
    color: "#214151",
    marginBottom: 12,
  },
  input: {
    outline: "None",
    border: "None",
    color: "#214151",
  },
  register: {
    marginTop: 5,
    backgroundColor: "#214151",
    color: "#214151",
  },
  extra: {
    color: "#214151",
    marginVertical: 12,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "EBGaramond-Regular",
  },
  link: {
    marginHorizontal: 3,
  },
});

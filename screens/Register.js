import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Form from "../Shared/Input/Form";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Register",
      headerStyle: { backgroundColor: "#eff7e1", fontWeight: "bold" },
      headerTitleStyle: { color: "#214151" },
      headerTintColor: "#214151",
      headerBackTitle: "Back to Register",
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

      <Form
        email={email}
        password={password}
        loading={loading}
        setEmail={setEmail}
        password={setPassword}
        name={"Register"}
        extra={"Already have an account? Login"}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  stretch: {
    width: 350,
    height: 270,
  },
  bg: {
    display: "flex",
    margin: "auto",
    marginBottom: 15,
  },
});

import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Form from "../../Shared/Input/Form";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../Redux/Actions/auth";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  function registerUser() {
    setLoading(true);
    dispatch(actions.register({ email, password }, navigation));
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#a2d0c1" },
      headerTintColor: "#a2d0c1",
      headerBackTitle: "Back to Register",
      title: "Register",
    });
  }, [navigation]);

  return (
    <SafeAreaView>
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
        name={"Register"}
        extra={"Already have an account? Login"}
        navigation={navigation}
        btnAction={registerUser}
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

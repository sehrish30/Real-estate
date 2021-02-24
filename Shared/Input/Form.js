import React from "react";
import { StyleSheet, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Input } from "react-native-elements";

const Form = ({
  navigation,
  password,
  email,
  setEmail,
  loading,
  setPassword,
  name,
  extra,
  btnAction,
}) => {
  const LoginOrRegister = () => {
    name === "Register"
      ? navigation.navigate("Login")
      : navigation.navigate("Register");
  };
  return (
    <KeyboardAwareScrollView style={styles.form}>
      <Input
        labelStyle={[styles.font, { color: "#a2d0c1" }]}
        rightIcon={{
          type: "font-awesome",
          name: "envelope",
          color: "#f8dc81",
        }}
        style={styles.input}
        onChangeText={(value) => setEmail(value)}
        value={email}
        label="Email"
      />
      {name !== "Change Password" && (
        <Input
          labelStyle={[styles.font, { color: "#a2d0c1" }]}
          rightIcon={{ type: "font-awesome", name: "key", color: "#f8dc81" }}
          style={styles}
          onChangeText={(value) => setPassword(value)}
          label="Password"
          value={password}
        />
      )}
      <Button
        buttonStyle={styles.register}
        raised
        title={name}
        loading={loading}
        onPress={btnAction}
      />
      <Text style={styles.extra} onPress={LoginOrRegister}>
        {extra}
      </Text>
    </KeyboardAwareScrollView>
  );
};

export default Form;

const styles = StyleSheet.create({
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

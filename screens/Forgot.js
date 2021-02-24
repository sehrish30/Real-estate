import React, { useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Button } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Form from "../Shared/Input/Form";

const Forgot = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1", fontWeight: "bold" },
      headerTitleStyle: { color: "#214151" },
      headerTintColor: "#214151",
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <Form
          email={email}
          setEmail={setEmail}
          loading={loading}
          name={"Change Password"}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Forgot;

const styles = StyleSheet.create({
  input: {
    color: "#214151",
  },
  register: {
    marginTop: 5,
    backgroundColor: "#214151",
    color: "#214151",
  },
});

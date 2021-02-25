import React, { useState, useLayoutEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Form from "../../Shared/Input/Form";

const Forgot = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#a2d0c1" },
      headerTintColor: "#a2d0c1",
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

import React, { useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Button } from "react-native-elements";

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
      <Input
        rightIcon={{
          type: "font-awesome",
          name: "envelope",
          color: "#f8dc81",
        }}
        style={styles.input}
        value={email}
        onChangeText={(value) => setEmail(value)}
        label="Email"
      />
      <Button
        buttonStyle={styles.register}
        raised
        title="Submit"
        loading={loading}
      />
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

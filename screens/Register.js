import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input } from "react-native-elements";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const Login = () => {
    navigation.navigate("Login");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Register",
      headerStyle: { backgroundColor: "#eff7e1", fontWeight: "bold" },
      headerTitleStyle: { color: "#214151" },
      headerTintColor: "#214151",
      headerBackTitle: "Back to Register",
      // headerRight: () => (
      //   <View
      //     style={{
      //       flexDirection: "row",
      //       justifyContent: "space-between",
      //       width: 80,
      //       marginRight: 20,
      //     }}
      //   >
      //     <TouchableOpacity activeOpacity={0.5}>
      //       <AntDesign name="search1" size={24} color="#214151" />
      //     </TouchableOpacity>
      //     <TouchableOpacity
      //       activeOpacity={0.5}
      //       // onPress={() => navigation.navigate("AddChat")}
      //     >
      //       <Ionicons name="notifications" size={24} color="#214151" />
      //     </TouchableOpacity>
      //   </View>
      // ),
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
          title="Register"
          loading={loading}
        />
        <Text style={styles.extra} onPress={Login}>
          Already have an account?<Text style={styles.link}>Login</Text>
        </Text>
      </SafeAreaView>
    </View>
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

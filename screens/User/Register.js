import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Form from "../../Shared/Input/Form";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../Redux/Actions/auth";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  function registerUser() {
    emailRegex = "/S+@S+.S+/";
    passRegex = "/(?=.*d)(?=.*[a-z]).{6,}/";
    if (email !== "" && emailRegex.test(email)) {
      if (password.length >= 6 && passRegex.test(password)) {
        setLoading(true);
        let newEmail = email;
        newEmail = newEmail.toLowerCase().trim();
        setEmail(newEmail);
        dispatch(actions.register({ email, password }, navigation));
      } else {
        Toast.show({
          type: "error",
          text1: `Password must be atleast 6 characters`,
          text2: `Must contain number`,
          visibilityTime: 4000,
          topOffset: 30,
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: `Email Invalid`,
        text2: `e.g: email@exp.com`,
        visibilityTime: 4000,
        topOffset: 30,
      });
    }
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
      <ScrollView>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;

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
});

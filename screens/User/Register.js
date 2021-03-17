import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Form from "../../Shared/Input/Form";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../Redux/Actions/auth";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { Button } from "react-native-elements";
import * as Google from "expo-google-app-auth";
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from "@env";
import { LinearGradient } from "expo-linear-gradient";
import { SimpleLineIcons } from "@expo/vector-icons";

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

  const googleSignin = async () => {
    try {
      const config = {
        androidClientId: IOS_CLIENT_ID,
        iosClientId: ANDROID_CLIENT_ID,
        scopes: ["profile", "email"],
      };
      const { type, user } = await Google.logInAsync(config);
      if (type == "success") {
        dispatch(
          actions.googleRegister(
            { email: user.email, photoUrl: user.photoUrl },
            navigation
          )
        );
      } else {
        console.error("Some error occured", type);
      }
    } catch (err) {
      console.error(err);
    }
  };

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
        <LinearGradient
          start={{ x: 0.0, y: 0.25 }}
          end={{ x: 0.5, y: 1.0 }}
          locations={[0, 0.8, 0.6]}
          colors={["#e4fbff", "#fff", "#e4fbff"]}
          // colors={["red", "blue", "green"]}
          style={styles.linearGradient}
        >
          <SimpleLineIcons
            style={{ marginRight: 20, marginTop: 2 }}
            name="social-google"
            color={"#214151"}
            size={30}
            onPress={googleSignin}
          />
          <Text style={styles.buttonText} onPress={googleSignin}>
            Register with Google
          </Text>
        </LinearGradient>
        <Text style={[styles.font, styles.heading]}>OR</Text>
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
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "EBGaramond-Bold",
    textAlign: "center",
    margin: 10,
    color: "#214151",
    backgroundColor: "transparent",
  },
  heading: {
    textAlign: "center",
    fontSize: 14,
    color: "#214151",
    marginBottom: 5,
    marginTop: 15,
  },
  font: {
    fontFamily: "EBGaramond-Regular",
  },
});

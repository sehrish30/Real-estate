import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Form from "../../Shared/Input/Form";
import { useDispatch } from "react-redux";
import * as actions from "../../Redux/Actions/auth";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import * as Google from "expo-google-app-auth";
import { SimpleLineIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from "@env";
import { Button } from "react-native-elements";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const goToAgencyLogin = () => {
    navigation.navigate("AgencyLogin");
  };

  const googleSignin = async () => {
    try {
      const config = {
        androidClientId: IOS_CLIENT_ID,
        iosClientId: ANDROID_CLIENT_ID,
        scopes: ["profile", "email"],
      };
      const { type, accessToken, user } = await Google.logInAsync(config);
      if (type == "success") {
        console.error(type, accessToken, user);
        dispatch(actions.googlelogin({ email: user.email }, navigation));
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
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
      headerTitle: "Login",
      headerRight: () => (
        <Icon
          style={{ marginRight: 20 }}
          onPress={goToAgencyLogin}
          name="ios-business"
          color={"#214151"}
          size={30}
        />
      ),
    });
  }, [navigation]);

  function LoginUser() {
    setLoading(true);
    let newEmail = email;
    newEmail = newEmail.toLowerCase().trim();
    // loginUser({ email, password });
    dispatch(
      actions.login({ email: newEmail, password }, navigation, setLoading)
    );
  }
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
          onPress={googleSignin}
        >
          <SimpleLineIcons
            style={{ marginRight: 20, marginTop: 2 }}
            name="social-google"
            color={"#214151"}
            size={30}
            onPress={googleSignin}
          />
          <Text style={styles.buttonText} onPress={googleSignin}>
            Sign in with Google
          </Text>
        </LinearGradient>
        <Text style={[styles.font, styles.heading]}>OR</Text>
        <Form
          email={email}
          password={password}
          loading={loading}
          setEmail={setEmail}
          setPassword={setPassword}
          name={"Login"}
          extra={"Don't have an account? Register"}
          navigation={navigation}
          btnAction={LoginUser}
        />
        <Text
          style={styles.extra}
          onPress={() => navigation.navigate("Forgot", { agencyForgot: false })}
        >
          Forgot Password
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  stretch: {
    width: 100,
    height: 80,
    marginBottom: 5,
  },
  bg: {
    display: "flex",
    margin: "auto",
    alignItems: "center",
  },

  font: {
    fontFamily: "EBGaramond-Regular",
  },
  heading: {
    textAlign: "center",
    fontSize: 14,
    color: "#214151",
    marginBottom: 5,
    marginTop: 15,
  },
  extra: {
    color: "#214151",
    marginVertical: 12,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "EBGaramond-Regular",
  },
  googlelogin: {
    backgroundColor: "#fff",
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
});

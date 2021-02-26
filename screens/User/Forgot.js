import React, { useState, useLayoutEffect, useRef } from "react";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Form from "../../Shared/Input/Form";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";
import { Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import {
  forgotUser,
  resetUserPassword,
} from "../../Shared/Services/AuthServices";
import { Button, Input } from "react-native-elements";
import Toast from "react-native-toast-message";
var { width, height } = Dimensions.get("window");

const Forgot = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [pin, setPin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const pinInput = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#a2d0c1" },
      headerTintColor: "#a2d0c1",
    });
  }, [navigation]);

  const checkCode = async (code) => {
    if (code !== pin) {
      await pinInput.current.shake();
      setPin("");
    } else {
      setShowPassword(true);
      setShowCode(false);
    }
  };

  const validateEmail = async () => {
    const res = await forgotUser({ email });
    setPin(res.data.code);
    setToken(res.data.token);
    setShowForm(false);
    setShowCode(true);
    console.log(email);
    if (
      email !== "" &&
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      const res = await forgotUser({ email });
      setPin(res.data.code);
      setToken(res.data.token);
      setShowForm(false);
      setShowCode(true);
    } else {
      Toast.show({
        type: "error",
        text1: `Please enter a valid email`,
        visibilityTime: 4000,
        topOffset: 30,
      });
    }
  };

  const resetPassword = async () => {
    setLoading(true);
    await resetUserPassword({ email, password }, token);
    navigation.navigate("home");
  };

  return (
    <View>
      <View style={styles.bg}>
        <Image
          style={styles.stretch}
          source={require("../../assets/login.png")}
          alt="bg"
        />
      </View>
      <Text style={[styles.font, styles.heading]}>Stay connected with us</Text>
      {showForm && (
        <View>
          <Form
            email={email}
            setEmail={setEmail}
            loading={loading}
            name={"Change Password"}
          />
          <Button
            buttonStyle={styles.register}
            raised
            title={"Submit"}
            loading={loading}
            onPress={validateEmail}
          />
        </View>
      )}

      {showPassword && (
        <>
          <Input
            labelStyle={[styles.font, { color: "#a2d0c1" }]}
            rightIcon={{
              type: "font-awesome",
              name: "key",
              color: "#f8dc81",
            }}
            secureTextEntry
            onChangeText={(value) => setPassword(value)}
            label="Password"
            value={password}
          />
          <Button
            buttonStyle={styles.register}
            raised
            title={"Reset Password"}
            loading={loading}
            onPress={resetPassword()}
          />
        </>
      )}

      {showCode && (
        <View style={styles.digit}>
          <Text h4 style={styles.command}>
            Enter your code
          </Text>
          <SmoothPinCodeInput
            placeholder="⭑"
            cellStyle={{
              borderWidth: 2,
              borderRadius: 24,
              borderColor: "#a2d0c1",
              backgroundColor: "#eff7e1",
            }}
            cellStyleFocused={{
              borderColor: "#214151",
              backgroundColor: "#eff7e1",
            }}
            textStyle={{
              fontSize: 24,
              color: "#a2d0c1",
            }}
            textStyleFocused={{
              color: "214151",
            }}
            ref={pinInput}
            value={pin}
            onTextChange={(code) => setPin(code)}
            onFulfill={checkCode}
            onBackspace={() => console.log("No more back.")}
            cellSize={36}
            codeLength={6}
          />
        </View>
      )}
    </View>
  );
};

export default Forgot;

const styles = StyleSheet.create({
  digit: {
    alignItems: "center",
  },
  command: {
    color: "#a2d0c1",
    paddingBottom: 10,
  },
  font: {
    fontFamily: "EBGaramond-Regular",
  },
  register: {
    marginTop: 5,
    backgroundColor: "#214151",
    color: "#214151",
  },
  stretch: {
    width: 100,
    height: 100,
  },
  bg: {
    display: "flex",
    margin: "auto",
    alignItems: "center",
  },
  heading: {
    textAlign: "center",
    fontSize: 25,
    color: "#214151",
    marginBottom: 12,
    marginTop: 5,
  },
});

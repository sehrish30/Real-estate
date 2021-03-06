import React, { useState, useLayoutEffect, useCallback, useRef } from "react";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import Form from "../../Shared/Input/Form";
import { Text } from "react-native-elements";
import {
  forgotUser,
  resetUserPassword,
} from "../../Shared/Services/AuthServices";
import { Button, Input } from "react-native-elements";
import Toast from "react-native-toast-message";
import { StatusBar } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useFocusEffect } from "@react-navigation/native";
var { width, height } = Dimensions.get("window");
import {
  checkIfEmailExists,
  resetPasswordAgency,
  checkCodeAgency,
  enterpassword,
} from "../../Shared/Services/AgencyServices";

const Forgot = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [pin, setPin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [value, setValue] = useState("");
  const CELL_COUNT = 6;
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  console.error("FORGET ABT IT", route.params);
  const { agencyForgot } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
    });
  }, [navigation]);

  const checkCode = async (code) => {
    console.log(typeof code);
    console.log(typeof pin);
    if (Number(code) !== Number(pin)) {
      setValue("");
      Toast.show({
        type: "error",
        text1: `Wrong code`,
        text2: `Try again!`,
        visibilityTime: 4000,
        topOffset: StatusBar.currentHeight + 10,
      });
    } else {
      setShowPassword(true);
      setShowCode(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (value.length === 6) {
        checkCode(value);
      }
    }, [value])
  );

  const validateEmail = async () => {
    let copyemail = email;
    console.log(email);
    setEmail(copyemail.toLowerCase().trim());

    // let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email !== "" && /\S+@\S+\.\S+/.test(email)) {
      if (agencyForgot) {
        const res = await checkIfEmailExists(email);
        if (res) {
          const response = await resetPasswordAgency({ email });
          setPin(response.code);
          setToken(response.token);
          setShowForm(false);
          setShowCode(true);
        } else {
          Toast.show({
            type: "error",
            text1: `Email is not registered in Ionic`,
            text2: `Try again`,
            visibilityTime: 2000,
            topOffset: StatusBar.currentHeight + 10,
          });
        }
      } else {
        const res = await forgotUser({ email });
        console.log(res);
        if (res) {
          setPin(res.data.code);
          setToken(res.data.token);
          setShowForm(false);
          setShowCode(true);
        }
      }
    } else {
      Toast.show({
        type: "error",
        text1: `Please enter a valid email`,
        visibilityTime: 4000,
        topOffset: StatusBar.currentHeight + 10,
      });
    }
  };

  const resetPassword = async () => {
    let agencyRegex = "/(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{6,}/";

    if (
      password.length >= 6 &&
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)
    ) {
      setLoading(true);
      let notcasesensitiveEmail = email;
      if (agencyForgot) {
        const reply = await enterpassword(
          { email: notcasesensitiveEmail.toLowerCase(), password },
          token
        );

        navigation.reset({
          routes: [{ name: "Home" }],
        });
        if (reply) {
          Toast.show({
            type: "success",
            text1: `Password updated`,
            visibilityTime: 4000,
            topOffset: StatusBar.currentHeight + 10,
          });
        }
      } else {
        const reply = await resetUserPassword(
          { email: notcasesensitiveEmail.toLowerCase(), password },
          token
        );
        navigation.reset({
          routes: [{ name: "Home" }],
        });
        if (reply) {
          Toast.show({
            type: "success",
            text1: `Password updated`,
            visibilityTime: 4000,
            topOffset: StatusBar.currentHeight + 10,
          });
        }
      }

      // navigation.navigate("Home");
    } else {
      Toast.show({
        type: "error",
        text1: `Password must be atleast 6 characters`,
        text2: `Password must have atleast 1 number`,
        visibilityTime: 4000,
        topOffset: StatusBar.currentHeight + 10,
      });
    }
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
            titleStyle={styles.btn}
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
            onChangeText={(password) => setPassword(password)}
            label="Password"
            value={password}
          />
          <Button
            buttonStyle={styles.register}
            titleStyle={styles.btn}
            raised
            title={"Reset Password"}
            loading={loading}
            onPress={resetPassword}
          />
        </>
      )}

      {showCode && (
        <View style={[styles.digit, styles.root]}>
          <Text style={styles.command}>Enter your code</Text>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFiledRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <View
                // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
                onLayout={getCellOnLayoutHandler(index)}
                key={index}
                style={[styles.cellRoot, isFocused && styles.focusCell]}
              >
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Forgot;

const styles = StyleSheet.create({
  btn: {
    fontFamily: "EBGaramond-Bold",
  },
  digit: {
    alignItems: "center",
  },
  command: {
    color: "#214151",
    paddingBottom: 10,
    textAlign: "center",
    marginHorizontal: "auto",
    fontFamily: "EBGaramond-Regular",
    fontSize: 25,
  },
  font: {
    fontFamily: "EBGaramond-Regular",
  },
  register: {
    marginTop: 5,
    backgroundColor: "#214151",
    color: "#214151",
    fontFamily: "EBGaramond-Bold",
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
    color: "#a2d0c1",
    marginBottom: 12,
    marginTop: 5,
  },
  root: {
    width: width / 1.2,
    minHeight: 300,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { textAlign: "center", fontSize: 30, fontFamily: "EBGaramond-Italic" },
  codeFiledRoot: {
    marginTop: 20,
    // width: 280,
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
  cellRoot: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#a2d0c1",
    borderBottomWidth: 2,
  },
  cellText: {
    color: "#214151",
    fontSize: 36,
    textAlign: "center",
  },
  focusCell: {
    borderBottomColor: "#f8dc81",
    borderBottomWidth: 3,
    color: "red",
  },
});

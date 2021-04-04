import React, { useState } from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import { Button, Input, Overlay, Text } from "react-native-elements";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import { changeAgencyPassword } from "../../Shared/Services/AuthServices";
import { useDispatch } from "react-redux";
import * as actions from "../../Redux/Actions/auth";
import { changeUserPasswordSrv } from "../../Shared/Services/AuthServices";
import { SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

var { width, height } = Dimensions.get("window");

const CustomModalPassword = ({
  changePassword,
  showPasswordModal,
  setShowPasswordModal,
  agencyId,
  navigation,
  dispatchProfile,
  userPassword = false,
  userId,
}) => {
  const dispatch = useDispatch();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage1, setErrorMessage1] = useState(null);
  const [errorMessage2, setErrorMessage2] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const servicePassword = async () => {
    if (newPassword !== "") {
      if (confirmNewPassword !== "") {
        if (confirmNewPassword === newPassword) {
          const token = await AsyncStorage.getItem("jwt");
          setLoading(true);
          let res;
          let resuser;
          if (userPassword) {
            const userData = {
              id: userId,
              password: oldPassword,
              newPassword: newPassword,
            };

            resuser = await changeUserPasswordSrv(userData, token);
            if (resuser) {
              setShowPasswordModal(false);
              setShowSuccess(true);
              console.error(res);
              setOldPassword("");
              setConfirmNewPassword("");
              setNewPassword("");
              setLoading(false);
            }
          } else {
            const data = {
              id: agencyId,
              password: oldPassword,
              newPassword: newPassword,
            };
            res = await changeAgencyPassword(data, token);
          }
          if (res) {
            setShowPasswordModal(false);
            setShowSuccess(true);
            setOldPassword("");
            setConfirmNewPassword("");
            setNewPassword("");

            dispatch(
              actions.loginAgencyAction({
                agency: res.newAgency,
                token: res.token,
                isLoggedInAgency: true,
              })
            );
            dispatchProfile({
              profile: res.newAgency,
              commercial: res.newAgency.commercial?.length,
              residential: res.newAgency.residential?.length,
              industrial: res.newAgency.industrial?.length,
              land: res.newAgency.land?.length,
            });
            await AsyncStorage.setItem("agency", JSON.stringify(res.newAgency));
            setLoading(false);
          }
        } else {
          setErrorMessage2("Passwords don't match");
        }
      } else {
        setErrorMessage2("Please enter password");
      }
    } else {
      setErrorMessage1("Please enter password");
    }
  };

  return (
    <>
      <KeyboardAwareScrollView style={{ width: width }}>
        <Overlay
          isVisible={showPasswordModal}
          onBackdropPress={() => {
            setShowPasswordModal(false);
          }}
          overlayStyle={{
            paddingVertical: 20,

            width: width,
            height: height,
          }}
        >
          <SafeAreaView style={{ margin: 20, marginTop: height / 6.5 }}>
            <View style={styles.header}>
              <Text
                style={[
                  styles.font,
                  { fontSize: 30, fontWeight: "800", marginBottom: 20 },
                ]}
              >
                Reset Password
              </Text>
            </View>
            <View style={{ marginTop: 25 }}>
              <Input
                labelStyle={[styles.font, { color: "#a2d0c1" }]}
                label="Old password"
                value={oldPassword}
                containerStyle={{ color: "blue" }}
                onChangeText={(value) => setOldPassword(value)}
                secureTextEntry
              />

              <Input
                labelStyle={[styles.font, { color: "#a2d0c1" }]}
                onChangeText={(value) => setNewPassword(value)}
                label="Password"
                value={newPassword}
                errorStyle={{ color: "red" }}
                errorMessage={errorMessage1}
                secureTextEntry
              />

              <Input
                labelStyle={[styles.font, { color: "#a2d0c1" }]}
                label="Confirm Password"
                value={confirmNewPassword}
                onChangeText={(value) => setConfirmNewPassword(value)}
                errorStyle={{ color: "red" }}
                errorMessage={errorMessage2}
                secureTextEntry
              />
            </View>
          </SafeAreaView>

          <Button
            title="Update password"
            loading={loading}
            buttonStyle={{ backgroundColor: "#214151", marginBottom: 10 }}
            titleStyle={{ fontFamily: "EBGaramond-Bold" }}
            style={styles.savebtn}
            onPress={() => {
              servicePassword();
            }}
          />
          <Button
            title="Cancel"
            type="outline"
            titleStyle={{ color: "#214151", fontFamily: "EBGaramond-Bold" }}
            style={styles.cancelbtn}
            onPress={() => {
              setShowPasswordModal(false);
            }}
          />
        </Overlay>
        <Overlay
          isVisible={showSuccess}
          onBackdropPress={() => {
            setShowPasswordModal(false);
          }}
          overlayStyle={{
            paddingVertical: 20,
            width: width / 1.2,
            height: height / 2,
            backgroundColor: "#214151",
            borderRadius: 10,
          }}
        >
          <Ionicons
            style={{
              marginLeft: "auto",
              verticalAlign: "middle",
            }}
            name="md-close"
            color={"#839b97"}
            size={20}
            onPress={() => setShowSuccess(false)}
          />
          <View style={{ margin: 20 }}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.headingModal}>Change Password</Text>
            </View>
          </View>
          <View style={{ margin: 20, alignItems: "center" }}>
            <FontAwesome5
              style={{
                marginRight: 8,
                verticalAlign: "middle",
              }}
              name="check-circle"
              color={"#98ded9"}
              size={60}
            />
          </View>
          <View style={{ alignItems: "center", marginTop: 25 }}>
            <Text style={styles.textInfo}>Thank you!</Text>
            <Text style={styles.textInfo}>
              Your password has been changed successfully
            </Text>
          </View>
        </Overlay>
      </KeyboardAwareScrollView>
    </>
  );
};

export default CustomModalPassword;

const styles = StyleSheet.create({
  texInput: {
    backgroundColor: "#edeef7",
    borderBottomColor: "#a2d0c1",
    borderBottomWidth: 1,
    fontFamily: "EBGaramond-Regular",
    fontSize: 16,
    color: "#214151",
    paddingHorizontal: 5,
  },

  savebtn: {
    color: "#214151",
    fontFamily: "EBGaramond-Bold",
  },
  cancelbtn: {
    fontFamily: "EBGaramond-Bold",
    color: "grey",
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginLeft: 10,
  },
  font: {
    fontFamily: "EBGaramond-Regular",
    color: "#214151",
  },
  header: {
    alignItems: "center",
    marginVertical: 10,
  },
  headingModal: {
    fontSize: 25,
    fontWeight: "800",
    fontFamily: "EBGaramond-Regular",
    color: "#e4fbff",
  },
  textInfo: {
    color: "#839b97",
    fontFamily: "EBGaramond-Regular",
    paddingTop: 5,
  },
});

import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Header } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Input, Overlay } from "react-native-elements";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomHeader from "../../Shared/HomeShared/CustomHeader";
import { useFocusEffect } from "@react-navigation/native";
import { getAffordibility } from "../../Shared/Services/AffordibilityServices";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";

var { width, height } = Dimensions.get("window");
const AffordibilityCalculator = ({ navigation }) => {
  let token = useSelector((state) => state.auth.token);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [monthlyexp, setMonthlyExp] = useState("");
  const [mortgage, setMortgage] = useState("");

  // values
  const [final10, setFinal10] = useState("");
  const [final20, setFinal20] = useState("");
  const [final30, setFinal30] = useState("");
  const [final40, setFinal40] = useState("");
  const [final50, setFinal50] = useState("");
  const [final60, setFinal60] = useState("");
  const [final70, setFinal70] = useState("");
  const [final80, setFinal80] = useState("");
  const [final90, setFinal90] = useState("");
  const [final100, setFinal100] = useState("");
  const [time, setTime] = useState("");

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const res = await getAffordibility();
        setFinal10(res[0].first);
        setFinal20(res[0].second);
        setFinal30(res[0].third);
        setFinal40(res[0].four);
        setFinal50(res[0].five);
        setFinal60(res[0].six);
        setFinal70(res[0].seven);
        setFinal80(res[0].eight);
        setFinal90(res[0].nine);
        setFinal100(res[0].ten);
        setTime(res[0].updatedAt);
      })();
    }, [])
  );

  const calculations = () => {
    const monthlyIncome = annualIncome / 12;
    const dir = (monthlyexp / monthlyIncome) * 100;
    const mortgageRate = (mortgage / monthlyIncome) * 100;
    const final = Math.round(mortgageRate + dir);

    if (annualIncome !== "" && monthlyexp !== "" && mortgage !== "") {
      if (final > 50 && final <= 100) {
        // Now tell the customer how much should he reduce
        let amounts = [10, 20, 30, 40, 50, 60];
        let increasedAnualIncome = 0;

        for (let x = 0; x < amounts.length; x++) {
          increasedAnualIncome = Number(annualIncome) + 5000;

          let mth = Math.round(increasedAnualIncome / 12);
          let newDirFromMortgage = (monthlyexp / mth) * 100;

          if (Math.round(newDirFromMortgage) + dir < 50) {
            let i = Math.round(increasedAnualIncome);
            // setResult(i);

            let chgdAnnual =
              Math.round(increasedAnualIncome) - Number(annualIncome);

            for (let amount of amounts) {
              if (final - amount < 50) {
                let calculation = Math.round((amount * monthlyIncome) / 100);

                setMessage(
                  <Text>
                    To buy a house you should decrease your expenditures around{" "}
                    <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                      {Math.round(calculation)}
                    </Text>{" "}
                    BD or increase your annual income by{" "}
                    <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                      {chgdAnnual}
                    </Text>{" "}
                    BD
                    <Text
                      style={{
                        color: "#214151",
                        fontFamily: "EBGaramond-Bold",
                      }}
                    >
                      {" "}
                      Admin's response:
                    </Text>
                    <Text>{final10}</Text>
                  </Text>
                );
                toggleOverlay();
                return;
              }
            }
          }
        }
      } else {
        if (final < 10) {
          setMessage(
            <Text>
              You may be able to afford a house worth about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                120,000{" "}
              </Text>
              BD for a payment of about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                {mortgage}
              </Text>{" "}
              BD / month
              <Text
                style={{
                  color: "#214151",
                  fontFamily: "EBGaramond-Bold",
                }}
              >
                {" "}
                Admin's response:
              </Text>
              <Text>{final20}</Text>
            </Text>
          );
        }
        if (final < 15) {
          setMessage(
            <Text>
              You may be able to afford a house worth about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                100,000{" "}
              </Text>
              BD for a payment of about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                {mortgage}
              </Text>{" "}
              BD / month
              <Text
                style={{
                  color: "#214151",
                  fontFamily: "EBGaramond-Bold",
                }}
              >
                {" "}
                Admin's response:
              </Text>
              <Text>{final30}</Text>
            </Text>
          );
          toggleOverlay();
          return;
        }
        if (final <= 20 && final > 15) {
          setMessage(
            <Text>
              You may be able to afford a house worth about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                90,000{" "}
              </Text>
              BD for a payment of about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                {mortgage}
              </Text>{" "}
              BD / month
              <Text
                style={{
                  color: "#214151",
                  fontFamily: "EBGaramond-Bold",
                }}
              >
                {" "}
                Admin's response:
              </Text>
              <Text>{final40}</Text>
            </Text>
          );
          toggleOverlay();
          return;
        }
        if (final <= 25 && final > 20) {
          setMessage(
            <Text>
              You may be able to afford a house worth about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                80,000{" "}
              </Text>
              BD for a payment of about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                {mortgage}
              </Text>{" "}
              BD / month
              <Text
                style={{
                  color: "#214151",
                  fontFamily: "EBGaramond-Bold",
                }}
              >
                {" "}
                Admin's response:
              </Text>
              <Text>{final50}</Text>
            </Text>
          );
          toggleOverlay();
          return;
        }
        if (final <= 30 && final > 25) {
          setMessage(
            <Text>
              You may be able to afford a house worth about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                70,000{" "}
              </Text>
              BD for a payment of about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                {mortgage}
              </Text>{" "}
              BD / month
              <Text
                style={{
                  color: "#214151",
                  fontFamily: "EBGaramond-Bold",
                }}
              >
                {" "}
                Admin's response:
              </Text>
              <Text>{final60}</Text>
            </Text>
          );
          toggleOverlay();
          return;
        }
        if (final <= 35 && final > 30) {
          setMessage(
            <Text>
              You may be able to afford a house worth about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                60,000{" "}
              </Text>
              BD for a payment of about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                {mortgage}
              </Text>{" "}
              BD / month
              <Text
                style={{
                  color: "#214151",
                  fontFamily: "EBGaramond-Bold",
                }}
              >
                {" "}
                Admin's response:
              </Text>
              <Text>{final70}</Text>
            </Text>
          );
          toggleOverlay();
          return;
        }
        if (final <= 40 && final > 35) {
          console.log("COMING");
          setMessage(
            <Text>
              You may be able to afford a house worth about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                50,000{" "}
              </Text>
              BD for a payment of about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                {mortgage}
              </Text>{" "}
              BD / month.
              <Text
                style={{
                  color: "#214151",
                  fontFamily: "EBGaramond-Bold",
                }}
              >
                {" "}
                Admin's response:
              </Text>
              <Text>{final80}</Text>
            </Text>
          );
          toggleOverlay();
          return;
        }
        if (final <= 45 && final > 40) {
          setMessage(
            <Text>
              You may be able to afford a house worth about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                40,000{" "}
              </Text>
              BD for a payment of about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                {mortgage}
              </Text>{" "}
              BD / month in {Math.round((40000 - mortgage) / 12)} years
              <Text
                style={{
                  color: "#214151",
                  fontFamily: "EBGaramond-Bold",
                }}
              >
                {" "}
                Admin's response:
              </Text>
              <Text>{final90}</Text>
            </Text>
          );
          toggleOverlay();
          return;
        }
        if (final <= 50 && final > 45) {
          setMessage(
            <Text>
              You may be able to afford a house worth about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                30,000{" "}
              </Text>
              BD for a payment of about{" "}
              <Text style={{ color: "#2c6e8f", fontWeight: "800" }}>
                {mortgage}
              </Text>{" "}
              BD / month in {Math.round((40000 - mortgage) / 12)} years
              <Text
                style={{
                  color: "#214151",
                  fontFamily: "EBGaramond-Bold",
                }}
              >
                {" "}
                Admin's response:
              </Text>
              <Text>{final100}</Text>
            </Text>
          );
        } else {
          setMessage(`Sorry your affordibility couldn't be caculated`);
          setAnnualIncome("");
          setMonthlyExp("");
          setMortgage("");
        }
      }

      toggleOverlay();
    } else {
      Toast.show({
        type: "error",
        text1: `All information is required to make it work`,
        text2: "Please, fill all the fields",
        visibilityTime: 8000,
        topOffset: StatusBar.currentHeight + 10,
      });
    }
  };

  const showMenu = () => {
    navigation.toggleDrawer();
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  return (
    <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
      <CustomHeader showMenu={showMenu} title={"Affordibility Calculator"} />
      <View style={{ flex: 1 }}>
        <LinearGradient
          // Button Linear Gradient
          colors={["#fff", "#e4fbff"]}
          style={styles.background}
        >
          <KeyboardAwareScrollView
            style={{ marginHorizontal: 10, marginTop: 20 }}
          >
            <Input
              label="Annual income (BD)"
              value={annualIncome}
              inputStyle={{
                color: "blue",
              }}
              inputContainerStyle={{
                backgroundColor: "#BCD7D2",
                padding: 5,
              }}
              labelStyle={{ color: "#214151" }}
              style={styles.input}
              keyboardType={"numeric"}
              onChangeText={(value) => setAnnualIncome(value)}
            />

            <Input
              value={monthlyexp}
              label="Monthly expenditure (BD)"
              labelStyle={{ color: "#214151" }}
              style={styles.input}
              inputContainerStyle={{
                backgroundColor: "#BCD7D2",
                padding: 5,
              }}
              keyboardType={"numeric"}
              onChangeText={(value) => setMonthlyExp(value)}
            />
            <View style={{ marginLeft: "auto", marginRight: 15 }}>
              <Text
                onPress={() => {
                  toggleOverlay();
                  setMessage(
                    "Includes Monthly credit card payments, Monthly auto payments, monthly loan payments (student or personal) and other monthly obligations like electric, phone etc."
                  );
                }}
                style={{
                  color: "#214151",
                  fontFamily: "EBGaramond-Italic",
                  fontSize: 16,
                }}
              >
                Details
              </Text>
            </View>
            <Input
              value={mortgage}
              label="Mortgage rate (BD)"
              labelStyle={{ color: "#214151" }}
              style={styles.input}
              inputContainerStyle={{
                backgroundColor: "#BCD7D2",
                padding: 5,
              }}
              keyboardType={"numeric"}
              onChangeText={(value) => setMortgage(value)}
            />
          </KeyboardAwareScrollView>
          <TouchableOpacity style={{ alignItems: "center" }}>
            <Button
              buttonStyle={{
                elevation: 2,
                borderRadius: 50,
                width: 90,
                height: 90,
                padding: 20,
                backgroundColor: "#c7ffd8",
                marginBottom: 10,
              }}
              titleStyle={{ color: "#214151" }}
              icon={
                <MaterialCommunityIcons
                  name="account-cash-outline"
                  size={40}
                  color="#214151"
                />
              }
              onPress={calculations}
              iconRight
              // title="Button with right icon"
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <Overlay
        overlayStyle={{
          backgroundColor: "#e4fbff",
          padding: 20,
          width: width / 1.2,
          elevation: 2,
        }}
        isVisible={visible}
        onBackdropPress={toggleOverlay}
      >
        <Icon
          style={{
            marginLeft: "auto",
          }}
          name="md-close"
          color={"#839b97"}
          size={20}
          onPress={toggleOverlay}
        />

        <Text style={{ fontFamily: "EBGaramond-Regular", fontSize: 18 }}>
          {message}
        </Text>
      </Overlay>
    </SafeAreaView>
  );
};

export default AffordibilityCalculator;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: height,
    position: "relative",
  },
  // menu: {
  //   paddingTop: 10,
  //   paddingRight: 20,
  // },
  text: {
    fontFamily: "EBGaramond-Bold",
    color: "#eff7e1",
    margin: 20,
    fontSize: 20,
  },
  input: { color: "#214151" },
});

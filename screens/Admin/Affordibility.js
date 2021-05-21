import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  Dimensions,
  View,
} from "react-native";
import { Button } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

var { width, height } = Dimensions.get("screen");
const Affordibility = () => {
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

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.main}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 20,
          padding: 10,
          backgroundColor: "#e4fbff",
        }}
      >
        <Text
          style={{
            color: "#214151",
            fontFamily: "EBGaramond-Bold",
          }}
        >
          Final = Mortgage rate + (monthly expenditure/monthly income) *100
        </Text>
      </View>

      <View style={{ marginVertical: 5 }}>
        <Text
          style={{
            textAlign: "left",
            fontFamily: "EBGaramond-Bold",
            color: "#214151",
            marginLeft: 15,
          }}
        >
          {"Final > 50 and final <= 100"}
        </Text>
        <TextInput
          style={styles.input}
          editable
          maxLength={40}
          multiline
          numberOfLines={5}
          onChangeText={() => {
            setFinal10("");
          }}
          value={final10}
        />
      </View>
      <View style={{ marginVertical: 5 }}>
        <Text
          style={{
            textAlign: "left",
            fontFamily: "EBGaramond-Bold",
            color: "#214151",
            marginLeft: 15,
          }}
        >
          {"Final < 10"}
        </Text>
        <TextInput
          style={styles.input}
          editable
          maxLength={40}
          multiline
          numberOfLines={5}
          onChangeText={() => {
            setFinal20("");
          }}
          value={final20}
        />
      </View>
      <View style={{ marginVertical: 5 }}>
        <Text
          style={{
            textAlign: "left",
            fontFamily: "EBGaramond-Bold",
            color: "#214151",
            marginLeft: 15,
          }}
        >
          {"Final < 15"}
        </Text>
        <TextInput
          style={styles.input}
          editable
          maxLength={40}
          multiline
          numberOfLines={5}
          onChangeText={() => {
            setFinal30("");
          }}
          value={final30}
        />
      </View>
      <View style={{ marginVertical: 5 }}>
        <Text
          style={{
            textAlign: "left",
            fontFamily: "EBGaramond-Bold",
            color: "#214151",
            marginLeft: 15,
          }}
        >
          {"final <= 20 and final > 15"}
        </Text>
        <TextInput
          style={styles.input}
          editable
          maxLength={40}
          multiline
          numberOfLines={5}
          onChangeText={() => {
            setFinal40("");
          }}
          value={final40}
        />
      </View>
      <View style={{ marginVertical: 5 }}>
        <Text
          style={{
            textAlign: "left",
            fontFamily: "EBGaramond-Bold",
            color: "#214151",
            marginLeft: 15,
          }}
        >
          {"final <= 25 and final > 20"}
        </Text>
        <TextInput
          style={styles.input}
          editable
          maxLength={40}
          multiline
          numberOfLines={5}
          onChangeText={() => {
            setFinal50("");
          }}
          value={final50}
        />
      </View>
      <View style={{ marginVertical: 5 }}>
        <Text
          style={{
            textAlign: "left",
            fontFamily: "EBGaramond-Bold",
            color: "#214151",
            marginLeft: 15,
          }}
        >
          {"final <= 30 and final > 25"}
        </Text>
        <TextInput
          style={styles.input}
          editable
          maxLength={40}
          multiline
          numberOfLines={5}
          onChangeText={() => {
            setFinal60("");
          }}
          value={final60}
        />
      </View>
      <View style={{ marginVertical: 5 }}>
        <Text
          style={{
            textAlign: "left",
            fontFamily: "EBGaramond-Bold",
            color: "#214151",
            marginLeft: 15,
          }}
        >
          {"final <=35 and final > 30"}
        </Text>
        <TextInput
          style={styles.input}
          editable
          maxLength={40}
          multiline
          numberOfLines={5}
          onChangeText={() => {
            setFinal70("");
          }}
          value={final70}
        />
      </View>
      <View style={{ marginVertical: 5 }}>
        <Text
          style={{
            textAlign: "left",
            fontFamily: "EBGaramond-Bold",
            color: "#214151",
            marginLeft: 15,
          }}
        >
          {"final <= 40 and final > 35"}
        </Text>
        <TextInput
          style={styles.input}
          editable
          maxLength={40}
          multiline
          numberOfLines={5}
          onChangeText={() => {
            setFinal80("");
          }}
          value={final80}
        />
      </View>
      <View style={{ marginVertical: 5 }}>
        <Text
          style={{
            textAlign: "left",
            fontFamily: "EBGaramond-Bold",
            color: "#214151",
            marginLeft: 15,
          }}
        >
          {"final <= 45 and final > 40"}
        </Text>
        <TextInput
          style={styles.input}
          editable
          maxLength={40}
          multiline
          numberOfLines={5}
          onChangeText={() => {
            setFinal90("");
          }}
          value={final90}
        />
      </View>
      <View style={{ marginVertical: 5 }}>
        <Text
          style={{
            textAlign: "left",
            fontFamily: "EBGaramond-Bold",
            color: "#214151",
            marginLeft: 15,
          }}
        >
          {"final <= 50 and final > 45"}
        </Text>
        <TextInput
          style={styles.input}
          editable
          maxLength={40}
          multiline
          numberOfLines={5}
          onChangeText={() => {
            setFinal100("");
          }}
          value={final100}
        />
      </View>
      <Button
        buttonStyle={{
          marginBottom: 50,
          width: width / 1.5,
          backgroundColor: "#214151",
        }}
        titleStyle={{
          fontFamily: "EBGaramond-Bold",
        }}
        title="Save"
      />
    </KeyboardAwareScrollView>
  );
};

export default Affordibility;

const styles = StyleSheet.create({
  main: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginHorizontal: 5,
    marginBottom: 20,
    // flex: 1,
  },
  fieldLabels: {
    color: "#839b97",
  },
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#214151",
    paddingHorizontal: 5,
  },
  input: {
    margin: 12,
    width: width / 1.2,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#839b97",
  },
});

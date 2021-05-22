import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  Dimensions,
  View,
} from "react-native";
import { formatDistanceToNow } from "date-fns";
import { useFocusEffect } from "@react-navigation/native";
import { Button } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";

import {
  getAffordibility,
  postAffordibility,
} from "../../Shared/Services/AffordibilityServices";
import { useSelector } from "react-redux";

var { width, height } = Dimensions.get("screen");
const Affordibility = () => {
  const [id, setId] = useState("");
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
  let token = useSelector((state) => state.auth.token);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const res = await getAffordibility(token);
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
        setId(res[0].id);
      })();
    }, [])
  );

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
        {time ? (
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Ionicons
              style={{ marginTop: 2 }}
              name="time"
              size={20}
              color="#214151"
            />
            <Text
              style={{
                marginTop: 5,
                color: "#214151",
                fontFamily: "EBGaramond-Bold",
              }}
            >
              {formatDistanceToNow(Date.parse(time), {
                addSuffix: true,
              })}
            </Text>
          </View>
        ) : null}
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
          maxLength={200}
          multiline
          numberOfLines={5}
          onChangeText={(text) => {
            setFinal10(text);
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
          maxLength={200}
          multiline
          numberOfLines={5}
          onChangeText={(text) => {
            setFinal20(text);
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
          maxLength={200}
          multiline
          numberOfLines={5}
          onChangeText={(text) => {
            setFinal30(text);
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
          maxLength={200}
          multiline
          numberOfLines={5}
          onChangeText={(text) => {
            setFinal40(text);
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
          maxLength={200}
          multiline
          numberOfLines={5}
          onChangeText={(text) => {
            setFinal50(text);
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
          maxLength={200}
          multiline
          numberOfLines={5}
          onChangeText={(text) => {
            setFinal60(text);
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
          maxLength={200}
          multiline
          numberOfLines={5}
          onChangeText={(text) => {
            setFinal70(text);
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
          maxLength={200}
          multiline
          numberOfLines={5}
          onChangeText={(text) => {
            setFinal80(text);
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
          maxLength={200}
          multiline
          numberOfLines={5}
          onChangeText={(text) => {
            setFinal90(text);
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
          maxLength={200}
          multiline
          numberOfLines={5}
          onChangeText={(text) => {
            setFinal100(text);
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
        onPress={async () => {
          await postAffordibility(
            {
              first: final10,
              second: final20,
              third: final30,
              four: final40,
              five: final50,
              six: final60,
              seven: final70,
              eight: final80,
              nine: final90,
              ten: final100,
              id: id,
            },
            token
          );
        }}
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
  },
  input: {
    margin: 12,
    width: width / 1.2,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#839b97",
    paddingHorizontal: 5,
    color: "#214151",
  },
});

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useReducer,
} from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  TextInput,
  RefreshControl,
} from "react-native";
import { formatISO9075 } from "date-fns";
import { Input, CheckBox } from "react-native-elements";
var { height, width } = Dimensions.get("screen");
import { Ionicons, Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { consultationRequest } from "../Services/NotificationServices";
import { useSelector } from "react-redux";

const ScheduleForm = ({
  showDatepicker,
  setLevel,
  showTimepicker,
  userDate,
  endTime,
  startTime,
  errors,
  duration,
  setEmail,
  email,
  phoneNumber,
  setPhoneNumber,
  checkedVirtual,
  setCheckedVirtual,
  checkedInPerson,
  setCheckedInPerson,
  setMessage,
  message,
  params,
  emailRef,
  phonenoRef,
  navigation: { goBack },
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [startTimeZone, setStartTimeZone] = useState("");
  const [loading, setLoading] = useState(false);
  const [endTimeZone, setEndTimeZone] = useState("");
  let token = useSelector((state) => state.auth.token);
  let user = useSelector((state) => state.auth.user);
  let socket = useSelector((state) => state.chat.socket);
  let userId;
  if (user.decoded.userId) {
    userId = user.decoded.userId;
  }

  const handleConsultation = async () => {
    setLoading(true);
    const checkProceed = () => {
      return Object.keys(errors).every(function (x) {
        return errors[x] === "" || errors[x] === null; // or just "return o[x];" for falsy values
      });
    };

    if (checkProceed()) {
      let isVirtual = true;
      if (checkedVirtual) {
        isVirtual = true;
      } else {
        isVirtual = false;
      }
      let formatEmail = email;

      let data = {
        customer: userId,
        agency: params.agencyId,
        phoneNumber,
        startTime,
        endTime,
        message,
        isVirtual,
        date: userDate,
        email: formatEmail.toLowerCase().trim(),
      };

      const res = await consultationRequest(data, token);

      if (res) {
        socket.emit("notifyConsultationRequest", data);
        goBack();
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPhoneNumber("");
    setMessage("");
    setEmail("");
    setLevel(1);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    if (startTime) {
      setStartTimeZone(startTime?.getUTCHours() / 12 >= 1 ? "pm" : "am");
    }
    if (endTime) {
      setEndTimeZone(endTime?.getUTCHours() / 12 >= 1 ? "pm" : "am");
    }
    return () => {};
  }, [startTime, endTime]);
  return (
    <ScrollView
      contentContainerStyle={styles.main}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* {console.error(errors.email)} */}
      <Input
        disabled={params?.email}
        inputStyle={styles.inputStyle}
        label="Email"
        labelStyle={styles.fieldLabels}
        inputContainerStyle={styles.inputContainer}
        rightIcon={<Ionicons name="mail-outline" size={24} color="#214151" />}
        onChangeText={(value) => setEmail(value)}
        value={email}
        ref={emailRef}
        errorMessage={errors.email}
      />
      <Input
        errorMessage={errors?.phoneno}
        ref={phonenoRef}
        disabled={params?.phoneNumber}
        keyboardType="numeric"
        inputStyle={styles.inputStyle}
        label="Phone number"
        labelStyle={styles.fieldLabels}
        inputContainerStyle={styles.inputContainer}
        value={phoneNumber}
        onChangeText={(value) => setPhoneNumber(value)}
        rightIcon={
          <MaterialCommunityIcons
            name="phone-outline"
            size={24}
            color="#214151"
          />
        }
      />

      <Input
        inputStyle={styles.inputStyle}
        label="Date"
        labelStyle={styles.fieldLabels}
        inputContainerStyle={styles.inputContainer}
        value={
          userDate ? formatISO9075(userDate, { representation: "date" }) : null
        }
        rightIcon={<Fontisto name="date" size={24} color="#214151" />}
        onPress={showDatepicker}
      />
      <View
        style={{
          flexDirection: "row",
          alignSelf: "flex-start",
          width: width / 2,
        }}
      >
        <Input
          inputStyle={styles.inputStyle}
          label="Start time"
          labelStyle={styles.fieldLabels}
          inputContainerStyle={styles.inputContainer}
          value={
            startTime
              ? formatISO9075(startTime, { representation: "time" })
              : null
          }
          rightIcon={
            <MaterialCommunityIcons
              name="clock-outline"
              size={24}
              color="#214151"
            />
          }
          onPress={() => {
            setLevel(1);
            showTimepicker();
          }}
          errorStyle={styles.error}
          errorMessage={errors.timeInterval}
        />
        <Input
          inputStyle={styles.inputStyle}
          label="End time"
          labelStyle={styles.fieldLabels}
          inputContainerStyle={styles.inputContainer}
          value={
            endTime ? formatISO9075(endTime, { representation: "time" }) : null
          }
          onPress={() => {
            setLevel(2);
            showTimepicker();
          }}
          rightIcon={
            <MaterialCommunityIcons
              name="clock-time-eight-outline"
              size={24}
              color="#214151"
            />
          }
        />
      </View>
      {duration ? (
        <Text style={styles.duration}>
          Your consultation duration is {duration} from{" "}
          {startTime
            ? formatISO9075(startTime, { representation: "time" }).substr(0, 5)
            : null}{" "}
          {startTimeZone} to{" "}
          {endTime
            ? formatISO9075(endTime, { representation: "time" }).substr(0, 5)
            : null}{" "}
          {endTimeZone}
        </Text>
      ) : null}
      <View style={styles.checkBoxes}>
        <CheckBox
          disabled={params?.phoneNumber}
          checkedColor="#214151"
          uncheckedColor="#839b97"
          containerStyle={{ backgroundColor: "#fff" }}
          center
          title="Meet in person"
          checked={checkedInPerson}
          onPress={() => {
            setCheckedInPerson(!checkedInPerson);
            setCheckedVirtual(!checkedVirtual);
          }}
        />
        <CheckBox
          disabled={params?.phoneNumber}
          checkedColor="#214151"
          uncheckedColor="#839b97"
          containerStyle={{ backgroundColor: "#fff" }}
          center
          title="Virtual meeting"
          checked={checkedVirtual}
          onPress={() => {
            setCheckedVirtual(!checkedVirtual);
            setCheckedInPerson(!checkedInPerson);
          }}
        />
      </View>

      <TextInput
        multiline
        numberOfLines={5}
        style={styles.input}
        onChangeText={(value) => setMessage(value)}
        value={message}
        selectionColor="#839b97"
        placeholder="Message..."
        placeholderTextColor="#839b97"
        maxLength={250}
      />
      <Button
        containerStyle={styles.schedulebtn}
        buttonStyle={styles.schedulebtninputContainer}
        titleStyle={{ color: "#fff", fontFamily: "EBGaramond-Bold" }}
        title={params?.email ? "Reschedule" : "Request consultation"}
        onPress={handleConsultation}
        loading={loading}
        disabled={loading}
      />
    </ScrollView>
  );
};

export default ScheduleForm;

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#214151",
    paddingHorizontal: 5,
  },
  fieldLabels: {
    color: "#839b97",
  },
  error: {
    color: "#e02e49",
    fontSize: 12,
  },
  duration: {
    fontFamily: "EBGaramond-Bold",
    color: "#214151",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  inputStyle: {
    color: "#214151",
  },
  schedulebtn: {
    marginVertical: 40,
    width: width / 1.5,
  },
  schedulebtninputContainer: {
    padding: 10,
    backgroundColor: "#214151",
  },
  main: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginHorizontal: 5,
  },
  checkBoxes: {
    flexDirection: "row",
  },
  input: {
    marginTop: 10,
    paddingHorizontal: 5,
    width: width / 1.1,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#214151",
    color: "#214151",
  },
});

import React, { useLayoutEffect, useReducer, useState, useEffect } from "react";

import { StyleSheet, ScrollView } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { intervalToDuration, formatDuration } from "date-fns";
import ScheduleForm from "../../Shared/HomeShared/ScheduleForm";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native";

const reducer = (state, newState) => ({ ...state, ...newState });
const initialState = {
  errors: {},
};
const ScheduleConsultationForm = ({ navigation, route }) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [userDate, setUserDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [level, setLevel] = useState(1);
  const [disableOptions, setDisableOptions] = useState(false);
  const [email, setEmail] = useState(route.params?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(
    route.params?.phoneNumber || ""
  );
  const [checkedVirtual, setCheckedVirtual] = useState(true);
  const [checkedInPerson, setCheckedInPerson] = useState(false);
  const [message, setMessage] = useState("");

  // if (route.params.email) {
  //   const { email, phoneNumber, meeting } = route.params;
  //   setEmail(email);
  //   setPhoneNumber(phoneNumber);
  //   if (meeting == "person") {
  //     setCheckedInPerson(true);
  //     setCheckedVirtual(false);
  //   }
  // }

  const [duration, setDuration] = useState("");

  const [{ errors }, dispatchErrors] = useReducer(reducer, initialState);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    if (mode === "date") {
      setUserDate(selectedDate);
    }

    if (mode === "time" && level === 1) {
      setStartTime(selectedDate);
    }
    if (mode === "time" && level === 2) {
      setEndTime(selectedDate);
    }
  };
  useEffect(() => {
    (() => {
      if (startTime && endTime) {
        let timedurationcheck = intervalToDuration({
          start: startTime,
          end: endTime,
        });
        if (timedurationcheck.hours < 1 && timedurationcheck.minutes < 30) {
          dispatchErrors({
            errors: {
              ...errors,
              timeInterval:
                "Time interval for consultation should be atleast 30 minutes",
            },
          });
          setDuration("");
        } else {
          setDuration(formatDuration(timedurationcheck));

          dispatchErrors({
            errors: {
              ...errors,
              timeInterval: "",
            },
          });
        }
      } else {
        setDuration("");
        dispatchErrors({
          errors: {
            ...errors,
            timeInterval: "",
          },
        });
      }
    })();
    return () => {};
  }, [startTime, endTime]);

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
    });

    return () => {};
  }, [navigation]);
  return (
    <SafeAreaView style={styles.form}>
      <ScheduleForm
        showDatepicker={showDatepicker}
        setLevel={setLevel}
        showTimepicker={showTimepicker}
        userDate={userDate}
        startTime={startTime}
        endTime={endTime}
        errors={errors}
        duration={duration}
        email={email}
        phoneNumber={phoneNumber}
        setEmail={setEmail}
        setPhoneNumber={setPhoneNumber}
        checkedVirtual={checkedVirtual}
        setCheckedVirtual={setCheckedVirtual}
        checkedInPerson={checkedInPerson}
        setCheckedInPerson={setCheckedInPerson}
        setMessage={setMessage}
        message={message}
        params={route.params}
      />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </SafeAreaView>
  );
};

export default ScheduleConsultationForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

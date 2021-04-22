import React, { useState, useRef, useEffect, useReducer } from "react";
import { Pressable, Dimensions } from "react-native";
import { StyleSheet, Modal, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { intervalToDuration, formatDuration, formatISO9075 } from "date-fns";
import { changeOfficeTiming } from "../Services/AgencyServices";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateProfile } from "../../Redux/Actions/auth";

const reducer = (state, newState) => ({ ...state, ...newState });
const initialState = {
  errors: {},
};
var { width } = Dimensions.get("screen");
const OfficeTiming = ({ showTiming }) => {
  let dispatch = useDispatch();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [endTimeZone, setEndTimeZone] = useState("");
  const [startTimeZone, setStartTimeZone] = useState("");
  const agency = useSelector((state) => state.auth.agency);
  const token = useSelector((state) => state.auth.token);

  const [mode, setMode] = useState("date");
  const [level, setLevel] = useState(1);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

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

  const showTimepicker = () => {
    showMode("time");
  };

  const [{ errors }, dispatchErrors] = useReducer(reducer, initialState);

  useEffect(() => {
    (() => {
      if (startTime) {
        setStartTimeZone(startTime?.getUTCHours() / 12 >= 1 ? "pm" : "am");
      }
      if (endTime) {
        setEndTimeZone(endTime?.getUTCHours() / 12 >= 1 ? "pm" : "am");
      }
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
                "Time interval for office hours should be atleast 30 minutes",
            },
          });
          setDuration("");
        } else if (endTimeRef.current.isFocused()) {
          setDuration(formatDuration(timedurationcheck));

          dispatchErrors({
            errors: {
              ...errors,
              timeInterval: null,
            },
          });
        }
      } else {
        setDuration("");
        dispatchErrors({
          errors: {
            ...errors,
            // timeInterval: null,
          },
        });
      }
    })();
    return () => {};
  }, [startTime, endTime]);

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <View style={{ flexDirection: "row" }}>
          <Input
            ref={startTimeRef}
            containerStyle={styles.inputStyle}
            inputStyle={styles.input}
            label="Start time"
            labelStyle={styles.fieldLabels}
            inputContainerStyle={styles.inputContainer}
            value={
              startTime
                ? formatISO9075(startTime, { representation: "time" })
                : null
            }
            onPress={() => {
              setLevel(1);
              showTimepicker();
            }}
            rightIcon={
              <MaterialCommunityIcons
                name="clock-outline"
                size={24}
                color="#214151"
                onPress={() => {
                  setLevel(2);
                  showTimepicker();
                }}
              />
            }
            errorStyle={styles.error}
            errorMessage={errors.timeInterval}
          />
          <Input
            ref={endTimeRef}
            inputStyle={styles.input}
            containerStyle={styles.inputStyle}
            label="End time"
            labelStyle={styles.fieldLabels}
            inputContainerStyle={styles.inputContainer}
            value={
              endTime
                ? formatISO9075(endTime, { representation: "time" })
                : null
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
                onPress={() => {
                  setLevel(2);
                  showTimepicker();
                }}
              />
            }
          />
        </View>
        {duration ? (
          <Text style={styles.duration}>
            Your office hours are for {duration} from{" "}
            {startTime
              ? formatISO9075(startTime, { representation: "time" }).substr(
                  0,
                  5
                )
              : null}{" "}
            {startTimeZone} to{" "}
            {endTime
              ? formatISO9075(endTime, { representation: "time" }).substr(0, 5)
              : null}{" "}
            {endTimeZone}
          </Text>
        ) : null}
        <View
          style={{
            flexDirection: "row",
            marginLeft: "auto",
          }}
        >
          <Button
            type="clear"
            titleStyle={{ fontFamily: "EBGaramond-Bold", color: "#34626c" }}
            onPress={showTiming}
            buttonStyle={styles.solid}
            title="Close"
            buttonStyle={{ marginRight: 10 }}
          />
          <Button
            disabled={
              startTime && endTime && !errors.timeInterval ? false : true
            }
            titleStyle={styles.font}
            onPress={async () => {
              let data = {
                id: agency.id,
                startTime: `${formatISO9075(startTime, {
                  representation: "time",
                }).substr(0, 5)} ${startTimeZone}`,
                endTime: `${formatISO9075(endTime, {
                  representation: "time",
                }).substr(0, 5)} ${endTimeZone}`,
              };
              const res = await changeOfficeTiming(data, token);
              AsyncStorage.setItem("agency", JSON.stringify(res)).then(() => {
                dispatch(updateProfile(res));
              });
              showTiming();
            }}
            buttonStyle={{ backgroundColor: "#214151" }}
            title="Save"
          />
        </View>
      </View>
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
    </View>
  );
};

export default OfficeTiming;

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#214151",
    paddingHorizontal: 5,
  },

  input: {
    color: "#214151",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: width / 1.1,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  solid: {
    backgroundColor: "white",
  },
  font: {
    color: "white",
    fontFamily: "EBGaramond-Bold",
  },
  inputStyle: {
    width: width / 2.5,
  },
  duration: {
    fontFamily: "EBGaramond-Bold",
    color: "#214151",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

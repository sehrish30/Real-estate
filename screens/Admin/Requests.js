import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import { Text } from "react-native-elements";

import { useFocusEffect } from "@react-navigation/native";

import AgencyPending from "../../Shared/Admin/AgencyPending";
import { rejectAgency } from "../../Shared/Services/AgencyServices";
import {
  getPendingAgencies,
  acceptAgency,
} from "../../Shared/Services/AgencyServices";
import { useSelector } from "react-redux";

var { width, height } = Dimensions.get("window");
const Requests = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get token of the logged in user
  let token = useSelector((state) => state.auth.token);

  const rejectService = async (id) => {
    const res = await rejectAgency(id, token);
    if (res) {
      setAgencies(agencies.filter((agency) => agency.id !== res));
    }
  };

  const acceptService = async (data) => {
    const res = await acceptAgency(data, token);
    if (res) {
      setAgencies(agencies.filter((agency) => agency.id !== res));
    }
  };

  useFocusEffect(
    useCallback(() => {
      var time;
      const btn = async () => {
        const data = await getPendingAgencies();

        if (data) {
          time = setTimeout(function () {
            setLoading(false);
            setAgencies(data);
          }, 4000);
        }
      };
      btn();
      return () => {
        setAgencies([]);
        setLoading(true);
        clearTimeout(time);
      };
    }, [])
  );

  return (
    <ScrollView>
      {loading ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: height / 2,
            flex: 1,
            padding: 10,
            marginVertical: "auto",
          }}
        >
          <ActivityIndicator size="large" color="#f8dc81" />
        </View>
      ) : null}

      {agencies.map((agency) => {
        return (
          <AgencyPending
            key={agency.id}
            acceptService={acceptService}
            agency={agency}
            rejectService={rejectService}
          />
        );
      })}
      {agencies.length === 0 && !loading && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: height / 7,
          }}
        >
          <Text
            style={{
              fontFamily: "EBGaramond-Bold",
              color: "#214151",
              fontSize: 20,
            }}
          >
            No agencies Found
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Requests;

const styles = StyleSheet.create({});

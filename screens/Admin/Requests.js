import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  Dimensions,
} from "react-native";

import { Text } from "react-native-elements";

import { useFocusEffect } from "@react-navigation/native";

import AgencyPending from "../../Shared/Admin/AgencyPending";
import ImagesOverlay from "../../Shared/Overlays/ImagesOverlay";
import { getPendingAgencies } from "../../Shared/Services/AgencyServices";
var { width, height } = Dimensions.get("window");
const Requests = () => {
  const [visible, setVisible] = useState(false);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

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

      {agencies.map((agency) =>
        agencies.length !== 0 ? (
          <>
            <AgencyPending
              key={agency.id}
              visible={visible}
              setVisible={setVisible}
              agency={agency}
            />
            <ImagesOverlay
              visible={visible}
              setVisible={setVisible}
              attachments={agency.attachments}
            />
          </>
        ) : loading ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: height,
              flex: 1,
              padding: 10,
              color: "#f8dc81",
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontFamily: "EBGaramond-Bold", color: "#214151" }}>
              No agencies Found
            </Text>
          </View>
        )
      )}
    </ScrollView>
  );
};

export default Requests;

const styles = StyleSheet.create({});

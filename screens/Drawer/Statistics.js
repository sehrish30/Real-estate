import React, { useCallback, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import ConsultationsStats from "../../Shared/HomeShared/ConsultationsStats";
import {
  getConsultationStatsForCustomer,
  getConsultationStatsForAgency,
} from "../../Shared/Services/NotificationServices";
import { SafeAreaView } from "react-native";

const Statistics = () => {
  let token = useSelector((state) => state.auth.token);

  let user = useSelector((state) => state.auth.user);
  let agency = useSelector((state) => state.auth.agency);
  let newNotiffication = useSelector((state) => state.consultation.new);
  // const graphicColor = ["#faeda5", "#B0DDD9", "#4B7E8F", "#E06A7F", "#2A5266"]; // Colors

  let colors = {
    pending: "#faeda5",
    reschedule: "#B0DDD9",
    declined: "#E06A7F",
    accepted: "#4B7E8F",
    paid: "#2A5266",
  };
  let wantedGraphicData = [{ y: 1 }, { y: 4 }, { y: 10 }, { y: 1 }, { y: 3 }]; // Data that we want to display
  const defaultGraphicData = [
    { y: 100 },
    { y: 0 },
    { y: 0 },
    { y: 0 },
    { y: 0 },
  ];

  const [graphicData, setGraphicData] = useState(defaultGraphicData);
  const [endAngle, setEndAngle] = useState(100);

  useFocusEffect(
    useCallback(() => {
      if (endAngle !== 360 || newNotiffication) {
        setGraphicData(defaultGraphicData);
        let data;

        const populatedata = () => {
          /*----------------------------------------------
                  FORMAT DATA FROM BACKEND
        ------------------------------------------------ */
          let newData = Object.keys(data)
            .filter((key) => data[key] !== 0)
            .reduce((obj, key) => {
              obj[key] = data[key];
              return obj;
            }, {});

          wantedGraphicData = [];
          Object.keys(newData).map((key, index) => {
            wantedGraphicData.push({
              y: newData[key],
              label: key,
              fill: colors[key],
            });
          });
          setGraphicData(wantedGraphicData); // Setting the data that we want to display
          setEndAngle(360);
        };
        if (agency.id) {
          (async () => {
            data = await getConsultationStatsForAgency(agency.id, token);

            if (data) {
              populatedata();
            }
          })();
        } else {
          (async () => {
            data = await getConsultationStatsForCustomer(
              user.decoded.userId,
              token
            );
            if (data) {
              populatedata();
            }
          })();
        }
      }

      return () => {};
    }, [])
  );
  return (
    <SafeAreaView style={styles.statistics}>
      <ScrollView>
        <ConsultationsStats graphicData={graphicData} endAngle={endAngle} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  statistics: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  badge: {
    padding: 5,
  },
});

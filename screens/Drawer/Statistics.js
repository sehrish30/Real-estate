import React, { useCallback, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import ConsultationsStats from "../../Shared/HomeShared/ConsultationsStats";
import {
  getConsultationStatsForCustomer,
  getConsultationStatsForAgency,
} from "../../Shared/Services/NotificationServices";
import {
  getAllReportedProperties,
  getAllPropertiesStats,
} from "../../Shared/Services/PropertyServices";
import { SafeAreaView } from "react-native";
import ReportedProperties from "../../Shared/HomeShared/ReportedProperties";
import TypesOfProperties from "../../Shared/HomeShared/TypesOfProperties";

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

  let reportedColors = {
    reported: "#E06A7F",
    properties: "#4B7E8F",
  };

  let typesReportsColors = {
    commercial: "#faeda5",
    residential: "#4B7E8F",
    industrial: "#B0DDD9",
    land: "#2A5266",
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
  const [reportedData, setReportedData] = useState(defaultGraphicData);
  const [propertiesType, setPropertiesType] = useState(defaultGraphicData);
  const [endAngle, setEndAngle] = useState(100);

  useFocusEffect(
    useCallback(() => {
      if (endAngle !== 360 || newNotiffication) {
        setGraphicData(defaultGraphicData);
        let data;
        let reportedProperties;
        let allPropertiesTypes;

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

        /*----------------------------------------------
                  FORMAT DATA FROM REPORTED PROPERTY
        ------------------------------------------------ */
        const populatereportdata = () => {
          /*----------------------------------------------
                  FORMAT DATA FROM BACKEND
        ------------------------------------------------ */
          let newData = Object.keys(reportedProperties)
            .filter((key) => reportedProperties[key] !== 0)
            .reduce((obj, key) => {
              obj[key] = reportedProperties[key];
              return obj;
            }, {});

          wantedGraphicData = [];
          Object.keys(newData).map((key, index) => {
            wantedGraphicData.push({
              y: newData[key],
              label: key,
              fill: reportedColors[key],
            });
          });
          setReportedData(wantedGraphicData); // Setting the data that we want to display
          setEndAngle(360);
        };

        /*----------------------------------------------
                Types of Properties
        ------------------------------------------------ */
        const populatetypedata = () => {
          /*----------------------------------------------
                  FORMAT DATA FROM BACKEND
        ------------------------------------------------ */
          let newData = Object.keys(allPropertiesTypes)
            .filter((key) => allPropertiesTypes[key] !== 0)
            .reduce((obj, key) => {
              obj[key] = allPropertiesTypes[key];
              return obj;
            }, {});

          wantedGraphicData = [];
          Object.keys(newData).map((key, index) => {
            wantedGraphicData.push({
              y: newData[key],
              label: key,
              fill: typesReportsColors[key],
            });
          });
          setPropertiesType(wantedGraphicData); // Setting the data that we want to display
          setEndAngle(360);
        };

        if (agency.id) {
          (async () => {
            data = await getConsultationStatsForAgency(agency.id, token);

            if (data) {
              populatedata();
            }
          })();
          (async () => {
            reportedProperties = await getAllReportedProperties(
              agency.id,
              token
            );

            if (reportedProperties) {
              populatereportdata();
            }
          })();
          (async () => {
            allPropertiesTypes = await getAllPropertiesStats(agency.id, token);
            if (allPropertiesTypes) {
              populatetypedata();
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
    }, [newNotiffication])
  );
  return (
    <SafeAreaView style={styles.statistics}>
      <ScrollView>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <ConsultationsStats graphicData={graphicData} endAngle={endAngle} />
          {agency.id && (
            <>
              <ReportedProperties
                graphicData={reportedData}
                endAngle={endAngle}
              />
              <TypesOfProperties
                graphicData={propertiesType}
                endAngle={endAngle}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  statistics: {
    paddingVertical: 20,
    // backgroundColor: "orange",
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#fff",
  },
  badge: {
    padding: 5,
  },
});

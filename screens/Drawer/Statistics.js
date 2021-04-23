import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import ConsultationsStats from "../../Shared/HomeShared/ConsultationsStats";

const Statistics = () => {
  const graphicColor = ["#faeda5", "#E06A7F", "#4B7E8F", "#B0DDD9", "#2A5266"]; // Colors
  const wantedGraphicData = [{ y: 1 }, { y: 4 }, { y: 10 }, { y: 1 }, { y: 3 }]; // Data that we want to display
  const defaultGraphicData = [
    { y: 0 },
    { y: 0 },
    { y: 100 },
    { y: 0 },
    { y: 30 },
  ];

  const [graphicData, setGraphicData] = useState(defaultGraphicData);

  useFocusEffect(
    React.useCallback(() => {
      setGraphicData(defaultGraphicData);
      let time = setTimeout(function () {
        setGraphicData(wantedGraphicData); // Setting the data that we want to display
      }, 500);
      return () => {
        clearTimeout(time);
      };
    }, [])
  );
  return (
    <View style={styles.statistics}>
      <ConsultationsStats
        graphicColor={graphicColor}
        graphicData={graphicData}
      />
    </View>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  statistics: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    padding: 5,
  },
});

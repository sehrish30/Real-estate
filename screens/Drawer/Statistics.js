import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Badge } from "react-native-elements";
import { VictoryPie } from "victory-native";
import { useFocusEffect } from "@react-navigation/native";

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
      <Text h4 h4Style={{ color: "#214151" }}>
        Consultation Requests
      </Text>
      <VictoryPie
        animate={{ easing: "exp" }}
        data={graphicData}
        width={250}
        height={250}
        colorScale={graphicColor}
        innerRadius={50}
        orientation="top"
        pointerLength={0}
        cornerRadius={4}
      />
      <View style={{ flexDirection: "row" }}>
        <Badge
          value="pending"
          badgeStyle={[{ backgroundColor: "#faeda5" }, styles.badge]}
          textStyle={{ color: "#214151" }}
        />
        <Badge
          value="declined"
          badgeStyle={[{ backgroundColor: "#E06A7F" }, styles.badge]}
        />
        <Badge
          value="accepted"
          badgeStyle={[{ backgroundColor: "#4B7E8F" }, styles.badge]}
        />
        <Badge
          value="reschedule"
          badgeStyle={[{ backgroundColor: "#B0DDD9" }, styles.badge]}
          textStyle={{ color: "#214151" }}
        />
        <Badge
          value="paid"
          badgeStyle={[{ backgroundColor: "#2A5266" }, styles.badge]}
        />
      </View>
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

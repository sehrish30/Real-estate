import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Text, Badge } from "react-native-elements";
// import { VictoryPie, VictoryLabel } from "victory-native";

import {
  VictoryPie,
  VictoryTooltip,
  VictoryLabel,
  VictoryChart,
  VictoryScatter,
  VictoryTheme,
} from "../../Victory";

let { width } = Dimensions.get("screen");

const ConsultationsStats = ({ graphicData, endAngle }) => {
  return (
    <View>
      <Text h4 h4Style={{ color: "#214151", paddingBottom: 10 }}>
        Consultation Requests
      </Text>
      <VictoryPie
        style={{
          data: {
            fill: ({ datum }) => datum.fill,
          },
        }}
        padAngle={({ datum }) => datum.y}
        innerRadius={100}
        labelComponent={<VictoryLabel angle={45} />}
        animate={{ easing: "exp" }}
        data={graphicData}
        width={250}
        height={250}
        // colorScale={graphicColor}
        innerRadius={50}
        orientation="top"
        pointerLength={0}
        cornerRadius={4}
        endAngle={endAngle}
      />
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          justifyContent: "center",
        }}
      >
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

export default ConsultationsStats;

const styles = StyleSheet.create({});

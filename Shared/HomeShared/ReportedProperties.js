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
const ReportedProperties = ({ graphicData, endAngle }) => {
  return (
    <View style={{ marginTop: 20 }}>
      <Text
        h4
        h4Style={{
          color: "#214151",
          paddingBottom: 10,
        }}
      >
        Reported Properties
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
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <Badge
          value="reported"
          badgeStyle={[{ backgroundColor: "#E06A7F" }, styles.badge]}
        />
        <Badge
          value="properties"
          badgeStyle={[{ backgroundColor: "#4B7E8F" }, styles.badge]}
        />
      </View>
    </View>
  );
};

export default ReportedProperties;

const styles = StyleSheet.create({});

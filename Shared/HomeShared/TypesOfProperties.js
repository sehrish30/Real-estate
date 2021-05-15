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
  VictoryBar,
} from "../../Victory";

let { width } = Dimensions.get("screen");

const TypesOfProperties = ({ graphicData, endAngle }) => {
  return (
    <View style={{ marginTop: 20 }}>
      <Text h4 h4Style={{ color: "#214151", paddingBottom: 10 }}>
        Types Of Properties
      </Text>
      <VictoryBar
        alignment="start"
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
          value="commercial"
          badgeStyle={[{ backgroundColor: "#faeda5" }, styles.badge]}
          textStyle={{ color: "#214151" }}
        />
        <Badge
          value="residential"
          badgeStyle={[{ backgroundColor: "#4B7E8F" }, styles.badge]}
        />
        <Badge
          value="industrial"
          badgeStyle={[{ backgroundColor: "#B0DDD9" }, styles.badge]}
          textStyle={{ color: "#214151" }}
        />
        <Badge
          value="land"
          badgeStyle={[{ backgroundColor: "#2A5266" }, styles.badge]}
        />
      </View>
    </View>
  );
};

export default TypesOfProperties;

const styles = StyleSheet.create({});

import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Badge } from "react-native-elements";
import { VictoryPie } from "victory-native";

const ConsultationsStats = ({ graphicData, graphicColor }) => {
  return (
    <View>
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

export default ConsultationsStats;

const styles = StyleSheet.create({});

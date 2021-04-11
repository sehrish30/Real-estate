import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ListItem } from "react-native-elements";
const DashboardList = ({ title, date, startTime, endTime }) => {
  return (
    <View style={styles.item}>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{title}</ListItem.Title>
          <View style={{ flexDirection: "row" }}>
            <ListItem.Subtitle>{date}</ListItem.Subtitle>
            <ListItem.Subtitle>
              {startTime}
              {endTime}
            </ListItem.Subtitle>
          </View>
        </ListItem.Content>
      </ListItem>
    </View>
  );
};

export default DashboardList;

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

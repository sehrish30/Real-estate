import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Fontisto";
import { Avatar } from "react-native-elements";
import { Card, Text, Button } from "react-native-elements";
import { Feather } from "@expo/vector-icons";

const AgencySearchCard = ({ index, agency, navigation }) => {
  return (
    <TouchableOpacity
      key={index}
      onPress={() => {
        navigation.navigate("AgencyDetail", {
          id: agency.id,
        });
      }}
    >
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.title}>
          <Text>{agency.name}</Text>
        </Card.Title>
        <Card.Divider />
        <View style={styles.agency}>
          <Avatar
            style={{ width: 50, height: 50 }}
            rounded
            source={{
              uri: agency.logo.url,
            }}
          />
          <View style={styles.basicInfo}>
            <Text h2 h2Style={styles.name}>
              {agency.bio ? `${agency.bio?.substring(0, 20)}...` : "No bio"}
            </Text>
            <Text style={[styles.name, { color: "#8dadb3", marginTop: 10 }]}>
              Commercial 40 | Residential 50 | industrial 60
            </Text>
          </View>
          <View style={{ marginLeft: "auto", flexDirection: "row" }}>
            <Text style={[styles.font, { fontSize: 18, color: "#f8dc81" }]}>
              {agency.rating || 0}
            </Text>
            <Icon
              // onPress={showMenu}

              name="star"
              color={"#f8dc81"}
              size={18}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default AgencySearchCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#eff7e1",
    borderRadius: 15,
    elevation: 4,
    shadowOffset: { width: 5, height: 5 },
    // boxShadow: "0 20px 50px #839b97",
    paddingTop: 5,
  },
  basicInfo: {
    paddingTop: 5,
    paddingHorizontal: 10,
    color: "#214151",
  },
  name: {
    fontFamily: "EBGaramond-Regular",
    fontSize: 14,
    fontWeight: "300",
  },
  font: {
    fontFamily: "EBGaramond-Regular",
  },
  agency: {
    display: "flex",
    flexDirection: "row",
  },
  title: {
    textAlign: "left",
    backgroundColor: "#c7ffd8",
    padding: 10,
    borderRadius: 5,
    margin: 0,
  },
});

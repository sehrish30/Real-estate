import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Fontisto";
import { Avatar } from "react-native-elements";
import { Card } from "react-native-elements";
var { width } = Dimensions.get("screen");
const AgencySearchCard = ({ index, agency, navigation }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      key={index}
      onPress={() => {
        navigation.navigate("AgencyDetail", {
          id: agency.id,
        });
      }}
    >
      <Card containerStyle={[styles.card]}>
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
            <Text style={[styles.onlySerif, { color: "#214151" }]}>
              {agency.bio ? `${agency.bio?.substring(0, 25)}...` : "No bio"}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.name,
                { color: "#8dadb3", marginTop: 10, width: width / 1.5 },
              ]}
            >
              Commercial {agency.commercial?.length || 0} | Residential{" "}
              {agency.residential?.length || 0} | Industrial{" "}
              {agency.industrial?.length || 0}
            </Text>
          </View>
          <View style={{ marginLeft: "auto", flexDirection: "row" }}>
            <Text style={[styles.font, { fontSize: 18, color: "#2c6e8f" }]}>
              {agency.totalRating || 0}
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
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 4,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "#214151",
    shadowOpacity: 0.2,
    paddingTop: 5,
  },
  basicInfo: {
    paddingTop: 5,
    paddingHorizontal: 10,
    color: "#214151",
  },
  onlySerif: {
    fontSize: 14,
    fontWeight: "300",
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
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 0,
    color: "#214151",
    fontFamily: "EBGaramond-Bold",
    paddingLeft: 10,
  },
});

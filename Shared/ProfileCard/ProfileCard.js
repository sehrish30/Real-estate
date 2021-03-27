import React from "react";
import {
  StyleSheet,
  View,
  Pressable,
  FlatList,
  Dimensions,
} from "react-native";
import { Image, Card, Text, Badge } from "react-native-elements";
import FontIcon from "react-native-vector-icons/FontAwesome";
import IonIcons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Button } from "react-native-elements";
import { useSelector } from "react-redux";

var { width, height } = Dimensions.get("screen");

import { Feather } from "@expo/vector-icons";
const ProfileCard = ({
  editAgency,
  logo,
  bio,
  user,
  locations,
  commercial,
  residential,
  industrial,
  land,
  showEditbutton,
  changePassword,
  navigation,
  id,
}) => {
  console.log(residential);
  let customer = useSelector((state) => state.auth.user);
  let agency = useSelector((state) => state.auth.agency);
  let userId = null;
  if (agency.id) {
    userId = agency.id;
  } else if (customer.decoded) {
    userId = customer?.decoded.userId;
  }

  const DATA = [
    {
      id: 0,
      title: commercial || 0,
      description: "Commercial",
    },
    {
      id: 1,
      title: residential || 0,
      description: "Residential",
    },
    {
      id: 3,
      title: industrial || 0,
      description: "Industrial",
    },
    {
      id: 4,
      title: land || 0,
      description: "Land",
    },
  ];

  const Item = ({ title, description }) => (
    <View style={styles.item}>
      <Text style={[styles.name, { color: "#8dadb3" }]}>{description}</Text>
      <Text h4 h4Style={{ fontSize: 15, marginTop: 8, color: "#214151" }}>
        {title}
      </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item description={item.description} title={item.title} />
  );

  return (
    <>
      <Card containerStyle={styles.bg}>
        {showEditbutton && (
          <View style={{ marginRight: "auto", flexDirection: "row" }}>
            <Pressable
              onPressOut={() => {
                editAgency();
              }}
            >
              <FontIcon
                style={{ verticalAlign: "middle", marginRight: 15 }}
                name="pencil-square"
                color={"#a2d0c1"}
                size={30}
              />
            </Pressable>
            <Pressable
              onPressOut={() => {
                changePassword();
              }}
            >
              <FontAwesome5
                style={{
                  verticalAlign: "middle",
                  marginRight: 15,
                  marginTop: 2,
                  padding: 5,
                  borderRadius: 4,
                  backgroundColor: "#a2d0c1",
                }}
                name="key"
                color={"#e4fbff"}
                size={15}
              />
            </Pressable>
          </View>
        )}

        <Card.Title style={styles.font}>
          <View stye={styles.imgSection}>
            <View style={styles.imageBlock}>
              <Image
                style={styles.image}
                resizeMode="cover"
                source={{ uri: logo?.url }}
              />
            </View>
            <Text style={[styles.font, styles.userText]}>{user}</Text>
          </View>
        </Card.Title>
        <Card.Divider />
        <Text style={styles.bio}>{bio}</Text>
        <Card.Divider />
        <View style={styles.locationRow}>
          <Text h4 h4Style={[styles.font, { fontSize: 16 }]}>
            <View style={{ verticalAlign: "middle" }}>
              <IonIcons
                style={{ marginRight: 8 }}
                name="ios-location-sharp"
                color={"#214151"}
                size={20}
              />
            </View>
            Locations
          </Text>

          <View style={styles.locationSection}>
            {locations?.map((location) => (
              <Badge
                key={location}
                value={location}
                badgeStyle={styles.location}
                textStyle={[styles.font, { color: "#214151", fontSize: 14 }]}
              />
            ))}
          </View>
        </View>
        <Card.Divider />
        <View style={styles.locationRow}>
          <Text h4 h4Style={[styles.font, { fontSize: 16 }]}>
            <View style={{ verticalAlign: "middle" }}>
              <FontAwesome5
                style={{
                  marginRight: 8,
                  verticalAlign: "middle",
                }}
                name="building"
                color={"#214151"}
                size={20}
              />
            </View>
            Properties
          </Text>
        </View>
        <View style={{}}>
          <FlatList
            numColumns={4}
            data={DATA}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={{ marginTop: 30, flexDirection: "row" }}>
          <Button
            onPress={() => {
              if (userId) {
                navigation.navigate("Chat", {
                  screen: "ChatMain",
                  params: {
                    agency: id,
                    customer: customer?.decoded.userId,
                    notsure: true,
                  },
                });
              } else {
                navigation.navigate("User");
              }
            }}
            buttonStyle={{ width: width / 2.5, backgroundColor: "#f8dc81" }}
            // containerStyle={{ backgroundColor: "red" }}
            titleStyle={{ color: "#214151" }}
            icon={
              <Feather
                style={{ marginRight: 5 }}
                name="message-square"
                size={15}
                color="#214151"
              />
            }
            title="Contact"
          />
          <Button
            type="outline"
            buttonStyle={{ width: width / 2.5, borderColor: "#f8dc81" }}
            titleStyle={{ color: "#214151" }}
            icon={
              <Feather
                style={{ marginRight: 5 }}
                name="phone-call"
                size={15}
                color="#214151"
              />
            }
            title="Call"
          />
        </View>
      </Card>
    </>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  bg: {
    // backDropFilter: "blur(6px)",
    backgroundColor: "#e4fbff",
    textAlign: "center",
  },
  imgSection: {
    display: "flex",
    flexDirection: "row",
    padding: 0,
  },
  imageBlock: {
    marginLeft: 25,
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginLeft: 10,
  },
  userText: {
    marginTop: 10,
  },
  bio: {
    fontFamily: "EBGaramond-Italic",
    color: "#306968",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  locationSection: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 5,
    textAlign: "center",
    paddingVertical: 20,
    alignItems: "center",
    marginHorizontal: "auto",
  },
  location: {
    padding: 10,
    backgroundColor: "#a2d0c1",
  },
  locationRow: {
    // marginHorizontal: "auto",
    padding: 5,
    paddingBottom: 0,
    alignItems: "center",
    backgroundColor: "#e4fbff",
    borderRadius: 5,
  },
  font: {
    fontFamily: "EBGaramond-Regular",
    color: "#214151",
  },
  item: {
    marginTop: 10,
    paddingTop: 20,
    alignItems: "center",
    width: 80,
  },
  name: {
    fontSize: 12,
  },
});

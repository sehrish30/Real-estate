import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  FlatList,
  Dimensions,
  Modal,
} from "react-native";
import { Image, Card, Text, Badge } from "react-native-elements";
import * as Linking from "expo-linking";
import { Button } from "react-native-elements";
import IonIcons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as MailComposer from "expo-mail-composer";
import { useSelector } from "react-redux";
import {
  SimpleLineIcons,
  MaterialCommunityIcons,
  EvilIcons,
  AntDesign,
} from "@expo/vector-icons";

var { width, height } = Dimensions.get("screen");

import { Feather } from "@expo/vector-icons";
import CustomOptionsOverlay from "../Overlays/CustomOptionsOverlay";
import RatingsReviews from "./RatingsReviews";
import OfficeTiming from "../Modals/OfficeTiming";
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
  phoneNumber,
  name,
  // rating,
  // reviews,
}) => {
  const [visible, setVisible] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [timing, setTiming] = useState(false);

  let customer = useSelector((state) => state.auth.user);
  let agency = useSelector((state) => state.auth.agency);
  let userId = null;

  if (agency?.id) {
    userId = agency.id;
  } else if (customer?.decoded) {
    userId = customer?.decoded?.userId;
  }

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const showTiming = () => {
    setTiming(!timing);
    console.error("OOYE");
  };

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
        <CustomOptionsOverlay
          changePassword={changePassword}
          editAgency={editAgency}
          visible={visible}
          showTiming={showTiming}
          toggleOverlay={toggleOverlay}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={timing}
          onRequestClose={() => {
            console.log("SDSD");
            setTiming(!timing);
          }}
        >
          <OfficeTiming showTiming={showTiming} />
        </Modal>
        {showEditbutton && (
          <View style={{ marginLeft: "auto", flexDirection: "row" }}>
            <Pressable
              onPressOut={() => {
                editAgency();
              }}
            >
              <SimpleLineIcons
                style={{ marginRight: 15 }}
                name="options-vertical"
                color={"#839b97"}
                size={30}
                onPress={toggleOverlay}
              />
            </Pressable>
          </View>
        )}

        <View style={[styles.font, styles.imgSection]}>
          <Image
            style={styles.image}
            resizeMode="cover"
            source={{ uri: logo?.url }}
          />

          <Text style={[styles.font, styles.userText]}>{name}</Text>
        </View>
        <Card.Divider />
        {bio?.length > 100 && !showFullBio ? (
          <Text onPress={() => setShowFullBio(!showFullBio)} style={styles.bio}>
            {bio.substr(0, 100)}...
          </Text>
        ) : (
          <Text onPress={() => setShowFullBio(!showFullBio)} style={styles.bio}>
            {bio}
          </Text>
        )}

        <Card.Divider />
        <View style={styles.locationRow}>
          <Text h4 h4Style={[styles.font, { fontSize: 16 }]}>
            <View>
              <IonIcons
                style={{ marginRight: 8 }}
                name="ios-location-outline"
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
            <View>
              <FontAwesome5
                style={{
                  marginRight: 8,
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

        <View
          style={{ marginTop: 30, flexDirection: "row", paddingBottom: 20 }}
        >
          {!agency.id && (
            <>
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
                onPress={() => {
                  Linking.openURL(`tel:${phoneNumber}`);
                }}
              />
              <Button
                raised={true}
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
            </>
          )}
        </View>
        {customer?.decoded?.userId && id && (
          <>
            <Button
              buttonStyle={{ backgroundColor: "#f8dc81" }}
              titleStyle={{ color: "#214151" }}
              icon={<EvilIcons name="calendar" size={30} color="#214151" />}
              title="Schedule Consultation"
              onPress={() => {
                navigation.navigate("ScheduleConsultationForm", {
                  agencyId: id,
                });
              }}
            />
            <Button
              buttonStyle={{ marginVertical: 10, borderColor: "#214151" }}
              titleStyle={{
                color: "#214151",
              }}
              icon={
                <MaterialCommunityIcons
                  name="email-outline"
                  size={18}
                  color="#214151"
                  style={{ marginRight: 5 }}
                />
              }
              title={"Email"}
              type="outline"
              onPress={async () => {
                const response = await MailComposer.isAvailableAsync();

                if (response) {
                  const res = await MailComposer.composeAsync({
                    recipients: [user],
                    subject: `Hello 👋, this is a buyer/seller from Iconic Real Estate`,
                    // attachments: [``],
                    body: "Iconic Real Estate",
                    isHtml: false,
                  });
                } else {
                  Linking.openURL(
                    `mailto:${user}?subject=Hello 👋, this is a seller/buyer from Iconic Real Estate=Description=I want to`
                  );
                }
              }}
            />
          </>
        )}
        <Card.Divider />
        {agency.id && agency.officeTimingStart && (
          <>
            <View style={[styles.locationRow, { marginVertical: 10 }]}>
              <Text h4 h4Style={[styles.font, { fontSize: 16 }]}>
                <View>
                  <AntDesign
                    style={{
                      marginRight: 8,
                    }}
                    name="clockcircleo"
                    color={"#214151"}
                    size={15}
                  />
                </View>
                {agency.officeTimingStart}-{agency.officeTimingEnd}
              </Text>
            </View>
            <Card.Divider />
          </>
        )}

        <RatingsReviews url={logo?.url} id={id} />
        <Button
          title="Rate"
          onPress={() => {
            navigation.navigate("UserRateReview", {
              id,
              userId,
            });
          }}
        />
      </Card>
    </>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  bg: {
    backgroundColor: "#e4fbff",
    textAlign: "center",
  },
  imgSection: {
    display: "flex",

    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: "auto",
    marginBottom: 15,
  },

  image: {
    width: 75,
    height: 75,
    borderRadius: 50,
  },
  userText: {
    marginTop: 10,
    fontWeight: "bold",
    // paddingRight: "auto",
  },
  bio: {
    fontFamily: "EBGaramond-Regular",
    color: "#306968",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "left",
    // letterSpacing: 0.5,
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

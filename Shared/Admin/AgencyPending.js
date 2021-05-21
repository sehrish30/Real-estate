import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Card, Button, Image, Badge, CheckBox } from "react-native-elements";

import ImagesOverlay from "../Overlays/ImagesOverlay";

const AgencyPending = ({ agency, rejectService, acceptService }) => {
  const [visible, setVisible] = useState(false);
  const [verified, setVerified] = useState(false);

  return (
    <Card containerStyle={styles.card}>
      <Card.Title style={styles.cardTitle}>{agency.name}</Card.Title>
      <Card.Divider />
      <View style={styles.cardContent}>
        <View style={{ alignItems: "center" }}>
          <Image
            style={styles.image}
            resizeMode="cover"
            alt={"Agency uploaded images"}
            source={{
              uri: agency.logo?.url,
            }}
          />
        </View>

        <View style={styles.subtitle}>
          <View style={styles.box}>
            <FontAwesome5
              style={{
                marginRight: 8,

                marginBottom: 6,
              }}
              name="phone-alt"
              color={"#98ded9"}
              size={20}
            />
            <Text style={styles.contact}>{agency.phoneNumber}</Text>
          </View>
          <View style={styles.box}>
            <MaterialCommunityIcons
              style={{
                marginRight: 8,

                marginBottom: 6,
              }}
              name="email"
              color={"#98ded9"}
              size={20}
            />
            <Text style={styles.contact}>{agency.email}</Text>
          </View>
        </View>
      </View>
      <Card.Divider />
      <View style={styles.locationRow}>
        <Text h4 h4Style={[styles.font, { fontSize: 16 }]}>
          <View>
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
          {agency.location?.map((location, i) => (
            <Badge
              key={i}
              value={location}
              badgeStyle={styles.location}
              textStyle={[styles.font, { color: "#214151", fontSize: 14 }]}
            />
          ))}
        </View>
      </View>
      <Card.Divider />
      <View>
        <Button
          type="clear"
          icon={
            <IonIcons
              style={{ marginRight: 8 }}
              name="ios-images"
              color={"#214151"}
              size={20}
            />
          }
          buttonStyle={{}}
          titleStyle={{ color: "#214151" }}
          title="Check Images"
          onPress={() => setVisible(true)}
        />
      </View>
      <Card.Divider />
      <View style={{ marginTop: 10 }}>
        <CheckBox
          containerStyle={{ backgroundColor: "transparent" }}
          center
          title="Verify agency"
          uncheckedColor="#839b97"
          checked={verified}
          checkedColor="#214151"
          onPress={() => setVerified(!verified)}
        />
        <Button
          icon={
            <FontAwesome5
              style={{
                marginRight: 8,
              }}
              name="check-circle"
              color={"#98ded9"}
              size={20}
            />
          }
          buttonStyle={{
            marginBottom: 10,
            backgroundColor: "#214151",
          }}
          titleStyle={{
            color: "#e4fbff",
          }}
          title="Accept"
          onPress={() =>
            acceptService({
              id: agency.id,
              email: agency.email,
              isVerified: verified,
            })
          }
        />
        <Button
          icon={
            <IonIcons
              style={{ marginRight: 8 }}
              name="close-circle-outline"
              color={"#e02e49"}
              size={25}
            />
          }
          buttonStyle={{
            marginBottom: 10,
            backgroundColor: "#eff7e1",
          }}
          titleStyle={{
            color: "#e02e49",
          }}
          title="Reject"
          onPress={() => rejectService(agency.id)}
        />
      </View>

      <ImagesOverlay
        visible={visible}
        setVisible={setVisible}
        attachments={agency.attachments}
      />
    </Card>
  );
};

export default AgencyPending;

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 50,
  },
  card: {
    borderRadius: 10,
    color: "#edeef7",
    backgroundColor: "#e4fbff",
  },
  cardTitle: {
    fontFamily: "EBGaramond-Bold",
  },
  cardContent: {
    padding: 5,
  },
  subtitle: {
    color: "#214151",
    marginTop: 20,
    fontSize: 16,
    alignItems: "center",
    flexDirection: "column",
  },
  contact: {
    // marginBottom: 20,
    color: "#214151",
    fontFamily: "EBGaramond-Regular",
    fontSize: 16,
  },
  box: {
    borderColor: "#839b97",
    alignItems: "center",
    // width: width / 2.5,
    padding: 5,
    marginBottom: 5,
  },
  locationRow: {
    // marginHorizontal: "auto",
    padding: 5,
    paddingBottom: 0,
    alignItems: "center",
    // backgroundColor: "#e4fbff",
    borderRadius: 5,
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
});

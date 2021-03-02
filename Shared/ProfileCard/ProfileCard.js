import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Image, Card, Text, Badge } from "react-native-elements";
import FontIcon from "react-native-vector-icons/FontAwesome";
import IonIcons from "react-native-vector-icons/Ionicons";

const ProfileCard = ({
  editAgency,
  logo,
  bio,
  user,
  setShowModal,
  locations,
}) => {
  return (
    <>
      <Card containerStyle={styles.bg}>
        <View style={{ marginRight: "auto" }}>
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
        </View>
        <Card.Title style={styles.font}>
          <View stye={styles.imgSection}>
            <View style={styles.imageBlock}>
              <Image
                style={styles.image}
                resizeMode="cover"
                source={{ uri: logo }}
              />
            </View>
            <Text style={[styles.font, styles.userText]}>{user}</Text>
          </View>
        </Card.Title>
        <Card.Divider />
        <Text style={styles.bio}>{bio}</Text>
      </Card>
      <View style={styles.locationRow}>
        <Text h4 h4Style={[styles.font, { fontSize: 16 }]}>
          <IonIcons
            style={{ verticalAlign: "middle", marginRight: 15 }}
            name="ios-location-sharp"
            color={"#214151"}
            size={20}
          />
          Locations
        </Text>

        <View style={styles.locationSection}>
          {locations.map((location) => (
            <Badge
              value={location}
              badgeStyle={styles.location}
              textStyle={[styles.font, { color: "#214151" }]}
              // containerStyle={styles.badgeSection}
            />
          ))}
        </View>
      </View>
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
    alignItems: "center",

    backgroundColor: "#e4fbff",
    borderRadius: 5,
  },
  font: {
    fontFamily: "EBGaramond-Regular",
    color: "#214151",
  },
});

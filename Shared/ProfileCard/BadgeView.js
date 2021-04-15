import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Badge } from "react-native-elements";
const BadgeView = ({
  highRating,
  setHighRating,
  lowRating,
  setLowRating,
  recent,
  setRecent,
  setSearch,
  setLocation,
}) => {
  const handleHighRating = () => {
    if (highRating) {
      setHighRating("");
    } else {
      setHighRating(2);
      setLowRating("");
      setRecent(false);
      setSearch("");
      setLocation("");
    }
  };

  const handleLowRating = () => {
    if (lowRating) {
      setLowRating("");
    } else {
      setLowRating(3);
      setHighRating("");
      setRecent(false);
      setSearch("");
      setLocation("");
    }
  };

  const handleNewItems = () => {
    if (recent) {
      setRecent(false);
    } else {
      setRecent(true);
      setLowRating("");
      setHighRating("");
      setSearch("");
      setLocation("");
    }
  };
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
      }}
    >
      <Badge
        onPress={handleHighRating}
        badgeStyle={highRating ? styles.selectedBadge : styles.badge}
        value={<Text style={styles.badgeText}>Higest Rating</Text>}
      />
      <Badge
        onPress={handleLowRating}
        badgeStyle={lowRating ? styles.selectedBadge : styles.badge}
        textStyle={styles.badgeText}
        value={<Text style={styles.badgeText}>Lowest Rating</Text>}
      />
      <Badge
        onPress={handleNewItems}
        badgeStyle={recent ? styles.selectedBadge : styles.badge}
        value={<Text style={styles.badgeText}>New</Text>}
      />
    </View>
  );
};

export default BadgeView;

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100,
    elevation: 3,
  },
  badgeText: {
    color: "#214151",
    fontFamily: "EBGaramond-Regular",
  },
  selectedBadge: {
    borderColor: "#214151",
    borderWidth: 3,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100,
  },
});

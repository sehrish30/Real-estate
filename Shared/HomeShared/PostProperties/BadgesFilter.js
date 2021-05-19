import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Badge } from "react-native-elements";
const BadgesFilter = ({
  residential,
  commercial,
  industrial,
  land,
  handleCommercial,
  handleIndustrial,
  handleResidential,
  handleLand,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginVertical: 20,
        justifyContent: "center",
      }}
    >
      <Badge
        onPress={handleResidential}
        badgeStyle={residential ? styles.selectedBadge : styles.badge}
        value={<Text style={styles.badgeText}>Residential</Text>}
      />
      <Badge
        onPress={handleCommercial}
        badgeStyle={commercial ? styles.selectedBadge : styles.badge}
        value={<Text style={styles.badgeText}>Commercial</Text>}
      />
      <Badge
        onPress={handleIndustrial}
        badgeStyle={industrial ? styles.selectedBadge : styles.badge}
        value={<Text style={styles.badgeText}>Industrial</Text>}
      />
      <Badge
        onPress={handleLand}
        badgeStyle={land ? styles.selectedBadge : styles.badge}
        value={<Text style={styles.badgeText}>Land</Text>}
      />
    </View>
  );
};

export default BadgesFilter;

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100,
    elevation: 3,
    zIndex: 3,
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

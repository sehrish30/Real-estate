import React, { useState, useEffect } from "react";
import {
  View,
  Platform,
  Button,
  Image,
  ScrollView,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import * as ImageManipulator from "expo-image-manipulator";
import { ImageBrowser } from "expo-image-picker-multiple";

function MainScreen(props) {
  const [photos, setPhotos] = useState([]);
  const [showBrowser, setShowBrowser] = useState(false);
  const [total, setTotal] = useState(0);
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>{photos.map((item, i) => renderImage(item, i))}</ScrollView>
    </View>
  );
}

export default MainScreen;
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    position: "relative",
  },
  emptyStay: {
    textAlign: "center",
  },
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: "absolute",
    right: 3,
    bottom: 3,
    justifyContent: "center",
    backgroundColor: "#0580FF",
  },
  countBadgeText: {
    fontWeight: "bold",
    alignSelf: "center",
    padding: "auto",
    color: "#ffffff",
  },
});

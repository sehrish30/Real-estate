import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { Overlay, Image } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";
import IonIcons from "react-native-vector-icons/Ionicons";
import Swiper from "react-native-web-swiper";

var { width, height } = Dimensions.get("window");

const toggleOverlay = () => {
  setVisible(!visible);
};

const PropertyImage = ({ visible, setVisible, attachments }) => {
  return (
    <Overlay
      isVisible={visible}
      backdropStyle={{ backgroundColor: "rgba(239, 247, 225, 0.4)" }}
      onBackdropPress={toggleOverlay}
      overlayStyle={{
        paddingVertical: 20,
        width: width,
        height: height,
      }}
    >
      <View style={{ flex: 1, backgroundColor: "#eff7e1" }}>
        <IonIcons
          style={{ marginLeft: "auto" }}
          name="close-circle-outline"
          color={"#214151"}
          size={30}
          onPress={() => {
            setVisible(false);
          }}
        />
        <Swiper
          from={1}
          minDistanceForAction={0.1}
          controlsProps={{
            dotsTouchable: true,
            prevPos: "left",
            nextPos: "right",
            nextTitle: (
              <FontAwesome name="arrow-circle-right" size={40} color="white" />
            ),
            nextTitleStyle: {
              color: "#34626c",
              fontSize: 24,
              fontWeight: "500",
            },
            dotActiveStyle: { backgroundColor: "#34626c" },
            PrevComponent: ({ onPress }) => (
              <TouchableOpacity onPress={onPress}>
                <FontAwesome name="arrow-circle-left" size={40} color="white" />
              </TouchableOpacity>
            ),
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#eff7e1",
            }}
          >
            <Text
              style={{
                color: "#214151",
                fontFamily: "EBGaramond-Italic",
                fontSize: 30,
              }}
            >
              Press next to view images
            </Text>
          </View>
          {attachments?.length === 0 && (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#eff7e1",
              }}
            >
              <Text
                style={{
                  color: "#214151",
                  fontFamily: "EBGaramond-Italic",
                  fontSize: 30,
                }}
              >
                No images found
              </Text>
            </View>
          )}
          {attachments?.map((attachment, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#eff7e1",
              }}
            >
              <Image
                source={{ uri: attachment?.url }}
                style={{ width: width, height: 500, objectFit: "cover" }}
                PlaceholderContent={<ActivityIndicator />}
              />
            </View>
          ))}
        </Swiper>
      </View>
    </Overlay>
  );
};

export default PropertyImage;

const styles = StyleSheet.create({});

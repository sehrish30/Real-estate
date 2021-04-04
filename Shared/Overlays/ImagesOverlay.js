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

import IonIcons from "react-native-vector-icons/Ionicons";
import Swiper from "react-native-web-swiper";

var { width, height } = Dimensions.get("window");

const toggleOverlay = () => {
  setVisible(!visible);
};

const ImagesOverlay = ({ visible, setVisible, attachments }) => {
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
          size={25}
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
            nextTitle: ">",
            nextTitleStyle: {
              color: "#34626c",
              fontSize: 24,
              fontWeight: "500",
            },
            dotActiveStyle: { backgroundColor: "#34626c" },
            PrevComponent: ({ onPress }) => (
              <TouchableOpacity onPress={onPress}>
                <Text
                  style={{
                    color: "#839b97",
                    fontSize: 24,
                    fontWeight: "500",
                  }}
                >
                  {"<"}
                </Text>
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
              Swipe to view images
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
                source={{ uri: attachment?.file.url }}
                style={{ width: 300, height: 500, objectFit: "cover" }}
                PlaceholderContent={<ActivityIndicator />}
              />
            </View>
          ))}
        </Swiper>
      </View>
    </Overlay>
  );
};

export default ImagesOverlay;

const styles = StyleSheet.create({});

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";

import { Image, Icon } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
let { width, height } = Dimensions.get("screen");
const MapLocationDetails = ({ setModalVisible, modalVisible }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image
            source={{
              uri:
                "http://res.cloudinary.com/abikhan/image/upload/v1619206515/rbeqffdujaemdhvnc78h.jpg",
            }}
            style={{ width: 50, height: 50 }}
            PlaceholderContent={<ActivityIndicator />}
          />
          <View style={styles.contentModal}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: width / 1.5,
              }}
            >
              <Text style={styles.title}>title</Text>
              <Text style={styles.title}>500 BD</Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.category}>Commercial</Text>
              <Text style={styles.category}>25/13/2021</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity style={{ marginTop: 20 }}>
                <Ionicons name="open-outline" size={24} color="#214151" />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: 20, marginTop: 20 }}>
                <Ionicons
                  name="close-circle-sharp"
                  size={24}
                  color="#ae061c"
                  onPress={() => {
                    setModalVisible(false);
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MapLocationDetails;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    marginTop: height / 1.6,
    padding: 0,
  },
  modalView: {
    flexDirection: "row",
    padding: 0,
    opacity: 0.8,
    // margin: 10,
    backgroundColor: "#fff",

    borderRadius: 20,
    padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontFamily: "EBGaramond-Bold",
    marginLeft: 20,
    fontSize: 16,
  },
  price: {
    fontFamily: "EBGaramond-Bold",
    fontSize: 16,
    color: "#214151",
  },
  category: {
    marginLeft: 20,
    marginTop: 5,
    fontSize: 12,
  },
  btns: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 0,
  },
});

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
import { formatDistanceToNow } from "date-fns";
let { width, height } = Dimensions.get("screen");
const MapLocationDetails = ({
  setModalVisible,
  modalVisible,
  info,
  navigation,
}) => {
  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
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
                info.propertyImages[0].url ||
                info.images[0] ||
                "https://images.unsplash.com/photo-1574786198875-49f5d09fe2d2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=799&q=80",
            }}
            style={{ width: 100, height: 100 }}
            PlaceholderContent={<ActivityIndicator />}
          />
          <View style={styles.contentModal}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: width / 3,
              }}
            >
              <Text style={styles.title}>{info.title}</Text>
              <Text style={styles.title}>{formatNumber(info.cost)} BD</Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.category}>{info.category}</Text>
              <Text style={styles.category}>
                {formatDistanceToNow(Date.parse(info.createdAt), {
                  addSuffix: true,
                })}
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity style={{ marginTop: 20 }}>
                <Ionicons
                  name="open-outline"
                  size={24}
                  color="#214151"
                  onPress={() => {
                    setModalVisible(!modalVisible);

                    navigation.navigate("PropertiesPosts", {
                      id: info._id,
                    });
                  }}
                />
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

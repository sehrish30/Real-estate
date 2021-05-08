import React, { useReducer, useCallback } from "react";
import { StyleSheet, Text, View, Modal, Dimensions } from "react-native";
import { CheckBox, Button } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { items } from "../Cities";
import { useSelector } from "react-redux";
import { propertyLocation } from "../Services/PropertyServices";

let { width } = Dimensions.get("screen");
const SubscribeLocations = ({
  modalVisible,
  setModalVisible,
  dispatchLocations,
  locations,
  originalLocations,
}) => {
  let token = useSelector((state) => state.auth.token);
  let user = useSelector((state) => state.auth.user);

  return (
    <Modal
      presentationStyle="fullScreen"
      style={{ margin: 0 }}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <ScrollView contentContainerStyle={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Subscribe to Locations</Text>
          <Text style={styles.submodalText}>You will be notified for </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {items.map((item, index) => (
              <CheckBox
                containerStyle={styles.containerLocations}
                left
                title={item.item}
                checked={locations[index]}
                checkedColor="#214151"
                uncheckedColor="#839b97"
                onPress={() => {
                  let value = locations;
                  value[index] = !locations[index];
                  dispatchLocations({
                    locations: value,
                  });
                }}
              />
            ))}
          </View>

          <View style={styles.modalbtn}>
            <Button
              type="clear"
              title="Close "
              titleStyle={{ color: "#214151" }}
              buttonStyle={{ marginRight: 15 }}
              onPress={() => {
                setModalVisible(false);

                dispatchLocations({
                  locations: originalLocations,
                });
              }}
            />
            <Button
              title="Subscribe"
              titleStyle={{ color: "#fff", fontFamily: "EBGaramond-Bold" }}
              buttonStyle={{ marginRight: 15, backgroundColor: "#214151" }}
              onPress={() => {
                let sendLocations = [];
                locations.map((location, index) =>
                  location ? sendLocations.push(items[index].item) : null
                );
                let data = {
                  userId: user.decoded.userId,
                  locations: sendLocations,
                };
                (async () => await propertyLocation(data, token))();
                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default SubscribeLocations;

const styles = StyleSheet.create({
  centeredView: {
    // flex: 1,

    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    // margin: 20,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "white",
    borderRadius: 20,
    // padding: 35,
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
  modalbtn: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: width,
    marginTop: 20,
    marginBottom: 40,
  },
  modalText: {
    fontFamily: "EBGaramond-Bold",
    color: "#214151",
    fontSize: 16,
    marginBottom: 15,
  },
  containerLocations: {
    backgroundColor: "#e4fbff",
    width: "40%",
  },
});

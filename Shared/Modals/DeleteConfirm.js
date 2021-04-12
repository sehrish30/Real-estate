import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import { Button } from "react-native-elements";
import { useSelector } from "react-redux";

var { height, width } = Dimensions.get("screen");
const DeleteConfirm = ({
  modalVisible,
  setModalVisible,
  agencyName,
  agencyId,
  customer,
  consultationId,
}) => {
  const token = useSelector((state) => state.auth.token);
  const socket = useSelector((state) => state.chat.socket);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to decline this consultation request?
            </Text>

            <View
              style={{
                width: width / 1.5,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Button
                titleStyle={[styles.font, { color: "#839b97" }]}
                title="Decline"
                type="outline"
                containerStyle={styles.outlinebtn}
                buttonStyle={styles.outline}
                onPress={async () => {
                  console.error(agencyName, agencyId, customer, consultationId);
                  declineConsultation(
                    {
                      id: consultationId,
                      customer,
                      agencyId,
                      agencyName,
                    },
                    token
                  );
                }}
              />
              <Button
                titleStyle={styles.font}
                onPress={() => setModalVisible(!modalVisible)}
                buttonStyle={styles.solid}
                title="Nope"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DeleteConfirm;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#e4fbff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,

    fontSize: 16,
    color: "#214151",
  },
  outlinebtn: {
    marginHorizontal: 10,
  },
  outline: {
    borderColor: "#839b97",
  },
  solid: {
    backgroundColor: "#214151",
  },
  font: { fontFamily: "EBGaramond-Bold" },
});

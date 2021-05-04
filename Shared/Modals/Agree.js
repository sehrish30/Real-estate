import React from "react";
import { StyleSheet, Text, View, Pressable, Modal } from "react-native";
import { Button } from "react-native-elements";

const Agree = ({
  modalVisible,
  setModalVisible,
  msg,
  cancelbtn,
  yesbtn,
  deleteAction,
}) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          //   Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{msg}</Text>
            <View style={styles.button}>
              <Button
                type="clear"
                titleStyle={[{ color: "#214151" }, styles.font]}
                title={yesbtn}
                buttonStyle={styles.clear}
                onPress={() => {
                  setModalVisible(false);
                }}
              />
              <Button
                title={cancelbtn}
                titleStyle={styles.font}
                buttonStyle={styles.allow}
                onPress={() => {
                  deleteAction();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Agree;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalText: {
    fontFamily: "EBGaramond-Regular",
    fontSize: 16,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
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
  clear: {
    color: "red",
  },
  font: {
    fontFamily: "EBGaramond-Bold",
  },
  allow: {
    backgroundColor: "#214151",
  },
  button: { flexDirection: "row", marginLeft: "auto", marginTop: 15 },
});

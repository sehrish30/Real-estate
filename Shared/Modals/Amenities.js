import React from "react";
import { StyleSheet, Text, View, Dimensions, Modal } from "react-native";
import SelectBox from "react-native-multi-selectbox";
import { Button } from "react-native-elements";

let { width, height } = Dimensions.get("screen");
const Amenities = ({
  label,
  options,
  values,
  action,
  close,
  setModalVisible,
  modalVisible,
}) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <SelectBox
            label={label}
            options={options}
            selectedValues={values}
            onMultiSelect={action()}
            onTapClose={close}
            isMulti
            arrowIconColor="#f8dc81"
            searchIconColor="#f8dc81"
            toggleIconColor="#f8dc81"
            inputFilterContainerStyle={{
              backgroundColor: "#f7f6e7",
            }}
            optionsLabelStyle={{
              color: "#214151",
              paddingLeft: 10,
            }}
            multiOptionContainerStyle={{
              backgroundColor: "#214151",
            }}
          />
          <Button
            titleStyle={{
              fontFamily: "EBGaramond-Bold",
            }}
            buttonStyle={styles.register}
            title="Done"
            onPress={() => {
              setModalVisible(false);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Amenities;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width / 1.5,
  },
  modalView: {
    marginTop: height / 3,
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
  register: {
    backgroundColor: "#214151",
    marginTop: 30,
  },
});

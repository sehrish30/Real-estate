import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  Image,
  Dimensions,
} from "react-native";
import { Button } from "react-native-elements";
import {
  Modal,
  ModalFooter,
  ModalButton,
  ModalContent,
  ScaleAnimation,
} from "react-native-modals";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { items } from "../Cities";
import SelectBox from "react-native-multi-selectbox";

var { width, height } = Dimensions.get("window");

const CustomModal = ({
  chosenLocations,
  showModal,
  logo,
  uploadLogoFromPhone,
  editBio,
  setShowModal,
  storeUserInfo,
  setEditBio,
}) => {
  function remove(item) {
    const filteredLocations = chosenLocations.filter(
      (location) => location.id !== item.id
    );
    setChosenLocations(filteredLocations);
  }

  function onMultiChange() {
    return (item) => {
      for (let i = 0; i < chosenLocations.length; i++) {
        if (chosenLocations[i].id === item.id) {
          remove(item);
          return;
        }
      }
      setChosenLocations([...chosenLocations, item]);
    };
  }

  function removeSelect() {
    return (item) => {
      const filteredLocations = chosenLocations.filter(
        (chosenLocations) => chosenLocations.id !== item.id
      );
      setChosenLocations(filteredLocations);
    };
  }

  return (
    <Modal
      visible={showModal}
      modalStyle={{ color: "red" }}
      animationDuration={600}
      modalAnimation={
        new ScaleAnimation({
          initialValue: 0, // optional
          useNativeDriver: true, // optional
        })
      }
      footer={
        <ModalFooter>
          <ModalButton
            textStyle={styles.cancelbtn}
            text="CANCEL"
            onPress={() => {
              setShowModal(false);
            }}
          />
          <ModalButton
            textStyle={styles.savebtn}
            text="SAVE"
            onPress={() => {
              setShowModal(false);
              storeUserInfo();
            }}
          />
        </ModalFooter>
      }
    >
      <ModalContent style={{ width: width / 1.2, height: height / 2 }}>
        <KeyboardAwareScrollView>
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Image
              style={styles.image}
              resizeMode="cover"
              source={{ uri: logo.uri }}
            />
            <Button
              titleStyle={{
                color: "#214151",
                fontSize: 16,
                fontFamily: "EBGaramond-Regular",
              }}
              title="Change Logo"
              type="clear"
              onPress={uploadLogoFromPhone}
            />
          </View>
          <TextInput
            style={styles.texInput}
            multiline
            numberOfLines={6}
            onChangeText={(text) => setEditBio(text)}
            value={editBio}
          />

          <SelectBox
            label="Locations"
            labelStyle={{ color: "#214151" }}
            style={[styles.font, { color: "#a2d0c1", marginVertical: 20 }]}
            options={items}
            selectedValues={chosenLocations}
            onMultiSelect={onMultiChange()}
            onTapClose={removeSelect()}
            isMulti
            arrowIconColor="#f8dc81"
            searchIconColor="#f8dc81"
            toggleIconColor="#f8dc81"
            inputFilterContainerStyle={{
              backgroundColor: "#f7f6e7",
              color: "#214151",
            }}
            inputFilterStyle={{
              color: "#214151",
              fontFamily: "EBGaramond-Regular",
              fontSize: 16,
            }}
            optionsLabelStyle={{
              color: "#214151",
              paddingLeft: 10,
            }}
            multiOptionContainerStyle={{
              backgroundColor: "#214151",
            }}
            value={chosenLocations}
          />
        </KeyboardAwareScrollView>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  texInput: {
    backgroundColor: "#edeef7",
    borderBottomColor: "#a2d0c1",
    borderBottomWidth: 1,
    fontFamily: "EBGaramond-Regular",
    fontSize: 16,
    color: "#214151",
    paddingHorizontal: 5,
  },

  savebtn: {
    color: "#214151",
    fontFamily: "EBGaramond-Bold",
  },
  cancelbtn: {
    fontFamily: "EBGaramond-Bold",
    color: "grey",
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginLeft: 10,
  },
});

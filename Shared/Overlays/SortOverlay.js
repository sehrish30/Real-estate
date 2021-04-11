import React from "react";
import { Button, Overlay } from "react-native-elements";
import { Dimensions } from "react-native";
import { CheckBox } from "react-native-elements";

var { width } = Dimensions.get("screen");
const SortOverlay = ({ toggleOverlay, visible, order, setOrder }) => {
  return (
    <Overlay
      overlayStyle={{ width: width / 1.5, borderRadius: 10 }}
      backdropStyle={{ backgroundColor: "rgba(239, 247, 225, 0.4)" }}
      isVisible={visible}
      onBackdropPress={toggleOverlay}
    >
      <CheckBox
        onPress={() => {
          setOrder(1);
          toggleOverlay();
        }}
        center
        title="Higest Rated"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        value={order}
        checked={order == 1 ? true : false}
        checkedColor="#214151"
        uncheckedColor="#839b97"
        textStyle={{
          color: order == 1 ? "#214151" : "#34626c",
        }}
        containerStyle={{
          backgroundColor: "#fff",
        }}
      />
      <CheckBox
        onPress={() => {
          setOrder(2);
          toggleOverlay();
        }}
        center
        title="Lowest rated"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        value={order}
        checked={order == 2 ? true : false}
        checkedColor="#214151"
        uncheckedColor="#839b97"
        textStyle={{
          color: order == 2 ? "#214151" : "#34626c",
        }}
        containerStyle={{
          backgroundColor: "#fff",
        }}
      />
      <CheckBox
        onPress={() => {
          setOrder(3);
          toggleOverlay();
        }}
        center
        title="Most recent"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        value={order}
        checked={order == 3 ? true : false}
        checkedColor="#214151"
        uncheckedColor="#839b97"
        textStyle={{
          color: order == 3 ? "#214151" : "#34626c",
        }}
        containerStyle={{
          backgroundColor: "#fff",
        }}
      />
      <CheckBox
        onPress={() => {
          setOrder(4);
          toggleOverlay();
        }}
        center
        title="Old"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        value={order}
        checked={order == 4 ? true : false}
        checkedColor="#214151"
        uncheckedColor="#839b97"
        textStyle={{
          color: order == 4 ? "#214151" : "#34626c",
        }}
        containerStyle={{
          backgroundColor: "#fff",
        }}
      />

      <Button
        onPress={toggleOverlay}
        title="Close"
        type="clear"
        titleStyle={{
          color: "#8dadb3",
        }}
        buttonStyle={{
          height: 50,
          marginVertical: 5,
        }}
      />
    </Overlay>
  );
};

export default SortOverlay;

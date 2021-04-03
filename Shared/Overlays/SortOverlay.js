import React, { useState } from "react";
import { Button, Overlay } from "react-native-elements";
import { Dimensions, Pressable } from "react-native";
import FontIcon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { CheckBox } from "react-native-elements";

var { width, height } = Dimensions.get("screen");
const SortOverlay = ({ toggleOverlay, visible }) => {
  const [order, setOrder] = useState(1);
  const [time, setTime] = useState(0);

  return (
    <Overlay
      overlayStyle={{ width: width / 1.5 }}
      isVisible={visible}
      onBackdropPress={toggleOverlay}
    >
      <CheckBox
        onPress={() => setOrder(1)}
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
        onPress={() => setOrder(2)}
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
        onPress={() => setOrder(3)}
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
        onPress={() => setOrder(4)}
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

import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Button, Overlay } from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";
var { width, height } = Dimensions.get("window");

const MenuOverlay = ({
  visible,
  setVisible,
  toggleOverlay,
  constDeleteAllMessages,
}) => {
  return (
    <View>
      <Overlay
        overlayStyle={{ width: width / 1.5 }}
        isVisible={visible}
        onBackdropPress={toggleOverlay}
      >
        <Button
          buttonStyle={{
            borderColor: "#a2d0c1",
            height: 50,
          }}
          containerStyle={{}}
          titleStyle={{
            color: "#214151",
            fontFamily: "EBGaramond-Bold",
          }}
          type="outline"
          icon={
            <FontAwesome
              style={{ paddingRight: 10 }}
              name="trash-o"
              size={15}
              color="#214151"
            />
          }
          title="Clear chat"
          onPress={() => {
            setVisible(false);
            constDeleteAllMessages();
          }}
        />
        <Button
          buttonStyle={{
            borderColor: "#a2d0c1",
            height: 50,
          }}
          titleStyle={{
            color: "#214151",
            fontFamily: "EBGaramond-Bold",
          }}
          type="outline"
          icon={
            <FontAwesome
              name="ban"
              size={15}
              color="#214151"
              style={{ paddingRight: 10 }}
            />
          }
          title="Block user"
          onPress={toggleOverlay}
        />
        <Button
          buttonStyle={{
            height: 50,
          }}
          type="clear"
          titleStyle={{ color: "#839b97", fontFamily: "EBGaramond-Bold" }}
          title="Close"
          onPress={toggleOverlay}
        />
      </Overlay>
    </View>
  );
};

export default MenuOverlay;

const styles = StyleSheet.create({});

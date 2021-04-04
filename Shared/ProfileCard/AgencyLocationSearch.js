import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SelectBox from "react-native-multi-selectbox";
import { items } from "../Cities";

const AgencyLocationSearch = ({ onChange, location, setLocation }) => {
  return (
    <View style={{ marginHorizontal: 15, marginTop: 5 }}>
      <SelectBox
        label="Select location"
        options={items}
        value={location}
        onChange={onChange()}
        hideInputFilter={false}
        arrowIconColor="#faeda5"
        searchIconColor="#8dadb3"
        style={[styles.font, { color: "#214151" }]}
        inputFilterContainerStyle={{
          backgroundColor: "#fff",
          borderRadius: 10,
        }}
        optionsLabelStyle={{
          color: "#214151",
          paddingLeft: 10,
          backgroundColor: "#e4fbff",
        }}
        optionContainerStyle={{
          backgroundColor: "#e4fbff",
        }}
        containerStyle={{
          backgroundColor: "#8dadb3",
          padding: 5,
          borderRadius: 10,
        }}
        inputFilterStyle={{
          color: "#214151",
          // fontFamily: "EBGaramond-Regular",
          fontSize: 16,
          paddingHorizontal: 5,
        }}
      />
      <Text
        onPress={() => {
          setLocation("");
        }}
        style={{
          fontFamily: "EBGaramond-Regular",
          color: "#8dadb3",
          marginLeft: "auto",
          marginTop: 5,
        }}
      >
        Clear location
      </Text>
    </View>
  );
};

export default AgencyLocationSearch;

const styles = StyleSheet.create({
  font: {
    fontFamily: "EBGaramond-Regular",
  },
});

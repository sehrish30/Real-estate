import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SelectBox from "react-native-multi-selectbox";
import { items } from "../Cities";

const AgencyLocationSearch = ({ onChange, location }) => {
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
          backgroundColor: "#f8dc81",
        }}
        optionsLabelStyle={{
          color: "#214151",
          paddingLeft: 10,
          backgroundColor: "#faeda5",
        }}
        optionContainerStyle={{
          backgroundColor: "#faeda5",
        }}
        containerStyle={{
          backgroundColor: "#8dadb3",
          padding: 5,
        }}
        inputFilterStyle={{
          color: "#214151",
          fontFamily: "EBGaramond-Regular",
          fontSize: 16,
          paddingHorizontal: 5,
        }}
      />
    </View>
  );
};

export default AgencyLocationSearch;

const styles = StyleSheet.create({
  font: {
    fontFamily: "EBGaramond-Regular",
  },
});

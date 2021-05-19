import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { Icon } from "react-native-elements";
const AmenityIcon = ({ name }) => {
  return (
    <>
      {name == "Fully Furnished" && (
        <Icon
          name="table-furniture"
          type="material-community"
          color="#839b97"
        />
      )}
      {name == "Partly Furnished" && (
        <Icon
          name="table-furniture"
          type="material-community"
          color="#839b97"
        />
      )}
      {name == "Central A/C" && (
        <Icon
          name="coolant-temperature"
          type="material-community"
          color="#839b97"
        />
      )}
      {name == "pool" && (
        <Icon name="pool" type="material-community" color="#839b97" />
      )}
      {name == "Shared pool" && (
        <Icon name="pool" type="material-community" color="#839b97" />
      )}
      {name == "Wardrobes" && (
        <Icon name="wardrobe" type="material-community" color="#839b97" />
      )}
      {name == "Kitchen Applicances" && (
        <Icon name="utensils" type="font-awesome-5" color="#839b97" />
      )}
      {name == "Parking" && (
        <Icon name="car-alt" type="font-awesome-5" color="#839b97" />
      )}
      {name == "Balcony" && (
        <Icon
          name="google-street-view"
          type="material-community"
          color="#839b97"
        />
      )}
      {name == "Garden" && (
        <Icon name="tree" type="material-community" color="#839b97" />
      )}
      {name == "Study" && <Icon name="book" type="ionicon" color="#839b97" />}
      {name == "Shared Spa" && (
        <Icon name="face-woman" type="material-community" color="#839b97" />
      )}
      {name == "View" && (
        <Icon
          name="google-street-view"
          type="material-community"
          color="#839b97"
        />
      )}
      {name == "Water View" && (
        <Icon name="water" type="font-awesome-5" color="#839b97" />
      )}
    </>
  );
};

export default AmenityIcon;

const styles = StyleSheet.create({});

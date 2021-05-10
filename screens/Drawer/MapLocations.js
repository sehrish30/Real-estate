import React, { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Modal,
  View,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import MapLocationDetails from "../../Shared/Modals/MapLocationDetails";
let { width, height } = Dimensions.get("screen");
const MapLocations = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
      headerTitle: "Search Properties",
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{
          ...StyleSheet.absoluteFillObject,
          height: 400,
          width: 400,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
        initialRegion={{
          latitude: 26.1112803858752,
          longitude: 50.548977414102204,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={styles.map}
      >
        <Marker
          pinColor="aqua"
          coordinate={{
            latitude: 26.06511777097489,
            longitude: 50.50512842133828,
          }}
          onPress={() => {
            setModalVisible(true);
          }}
        />
        <Marker
          pinColor="aqua"
          coordinate={{
            latitude: 26.03249589178873,
            longitude: 50.51141226508145,
          }}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
        />

        <Marker
          pinColor="aqua"
          coordinate={{
            latitude: 26.065542160714863,
            longitude: 50.51328399270143,
          }}
          onPress={() => {
            setModalVisible(true);
          }}
        />
      </MapView>
      {modalVisible && (
        <View>
          <MapLocationDetails
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        </View>
      )}
    </View>
  );
};

export default MapLocations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

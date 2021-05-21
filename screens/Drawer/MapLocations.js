import React, {
  useLayoutEffect,
  useState,
  useCallback,
  useReducer,
} from "react";
import {
  StyleSheet,
  Modal,
  View,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { getAllProperties } from "../../Shared/Services/PropertyServices";
import { useFocusEffect } from "@react-navigation/native";

import MapLocationDetails from "../../Shared/Modals/MapLocationDetails";
let { width, height } = Dimensions.get("screen");

const reducer = (state, newState) => ({ ...state, ...newState });
const initialState = {
  details: [],
  info: {},
};

const MapLocations = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [{ details, info }, dispatchMap] = useReducer(reducer, initialState);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
      headerTitle: "Search Properties",
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        let data = await getAllProperties();

        dispatchMap({
          details: data,
        });
      })();
    }, [])
  );
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
        {details.map((property) => (
          <Marker
            pinColor="aqua"
            coordinate={{
              latitude: property.location.latitude,
              longitude: property.location.longitude,
            }}
            onPress={() => {
              setModalVisible(true);
              dispatchMap({
                info: property,
              });
            }}
          />
        ))}
      </MapView>
      {modalVisible && (
        <View>
          <MapLocationDetails
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            info={info}
            navigation={navigation}
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

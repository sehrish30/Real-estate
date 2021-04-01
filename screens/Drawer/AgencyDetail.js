import React, { useCallback, useReducer, useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { getAgencyDetails } from "../../Shared/Services/ProfileServices";
import ProfileCard from "../../Shared/ProfileCard/ProfileCard";
import { ScrollView } from "react-native-gesture-handler";

// Reducers State
const reducer = (state, newState) => ({ ...state, ...newState });
const initialState = {
  profile: {},
  commercial: 0,
  land: 0,
  residential: 0,
  industrial: 0,
  rating: [],
  reviews: [],
};

const AgencyDetail = ({ route, navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
    });

    return () => {};
  }, [navigation]);

  // REDUCERS
  const [
    { profile, commercial, land, residential, industrial },
    dispatchProfile,
  ] = useReducer(reducer, initialState);

  useFocusEffect(
    useCallback(() => {
      const id = route.params.id;
      console.log(id);
      const getService = async () => {
        const res = await getAgencyDetails(id);
        console.log(res, "GIRL");
        dispatchProfile({
          profile: res,
          commercial: res.commercial?.length,
          residential: res.residential?.length,
          industrial: res.industrial?.length,
          land: res.land?.length,
        });
      };
      getService();

      return () =>
        dispatchProfile({
          profile: {},
          commercial: 0,
          land: 0,
          residential: 0,
          industrial: 0,
        });
    }, [])
  );
  return (
    <ScrollView>
      <ProfileCard
        logo={profile.logo}
        bio={profile.bio}
        user={profile.email}
        id={profile.id}
        locations={profile.location}
        commercial={commercial}
        land={land}
        residential={residential}
        industrial={industrial}
        navigation={navigation}
        phoneNumber={profile.phoneNumber}
      />
    </ScrollView>
  );
};

export default AgencyDetail;

const styles = StyleSheet.create({});

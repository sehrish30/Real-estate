import React, { useCallback, useReducer, useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
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
};

const AgencyDetail = ({ route, navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#a2d0c1" },
      headerTintColor: "#a2d0c1",
    });
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
        locations={profile.location}
        commercial={commercial}
        land={land}
        residential={residential}
        industrial={industrial}
      />
    </ScrollView>
  );
};

export default AgencyDetail;

const styles = StyleSheet.create({});

import React, {
  useCallback,
  useReducer,
  useLayoutEffect,
  useState,
} from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { getAgencyDetails } from "../../Shared/Services/ProfileServices";
import ProfileCard from "../../Shared/ProfileCard/ProfileCard";
import { ScrollView } from "react-native-gesture-handler";
import Loading from "../../Shared/Loading";

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
  const [loading, setLoading] = useState(true);
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

      const getService = async () => {
        const res = await getAgencyDetails(id);
        console.log("HAHAHAHHA", res);
        dispatchProfile({
          profile: res,
          commercial: res.commercial?.length,
          residential: res.residential?.length,
          industrial: res.industrial?.length,
          land: res.land?.length,
        });
        setLoading(false);
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
      {loading ? (
        <Loading />
      ) : (
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
          name={profile.name}
        />
      )}
    </ScrollView>
  );
};

export default AgencyDetail;

const styles = StyleSheet.create({});

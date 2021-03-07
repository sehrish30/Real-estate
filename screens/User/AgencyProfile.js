import React, { useLayoutEffect, useState, useReducer } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntIcon from "react-native-vector-icons/AntDesign";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, updateProfile } from "../../Redux/Actions/auth";

import {
  uploadLogoToCloudinary,
  uploadImageFromPhone,
} from "../../Shared/services";

import {
  uploadLogoUpdate,
  editAgencyProfile,
} from "../../Shared/Services/ProfileServices";

import ProfileCard from "../../Shared/ProfileCard/ProfileCard";
import CustomModal from "../../Shared/Input/CustomModal";

// Context
const reducer = (state, newState) => ({ ...state, ...newState });
const initialState = {
  profile: {},
  commerical: 0,
  land: 0,
  residential: 0,
  industrial: 0,
};

const AgencyProfile = ({ navigation }) => {
  // REDUCERS
  const [
    { profile, commerical, land, residential, industrial },
    dispatchProfile,
  ] = useReducer(reducer, initialState);

  // States
  const [editBio, setEditBio] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [chosenLocations, setChosenLocations] = useState([]);
  const dispatch = useDispatch();

  const agency = useSelector((state) => state.auth.agency);

  // Actions
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("jwt");
      await AsyncStorage.removeItem("agency");
      await AsyncStorage.removeItem("isLoggedInAgency");
      dispatch(logoutUser());
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const editAgency = () => {
    setEditBio(profile.bio);
    setShowModal(true);
  };

  const storeUserInfo = async () => {
    let token = await AsyncStorage.getItem("jwt");
    let res;

    if (chosenLocations.length === 0) {
      res = await editAgencyProfile(
        { bio: editBio, id: profile.id, location: profile.location },
        token
      );
    } else {
      let locationItems;
      locationItems = chosenLocations.map((location) => location.item);
      res = await editAgencyProfile(
        { bio: editBio, id: profile.id, location: locationItems },
        token
      );
      setChosenLocations([]);
    }

    if (res) {
      // Update store
      let payload = { ...agency, bio: editBio, location: res.location };
      dispatch(updateProfile(payload));

      dispatchProfile({
        profile: payload,
        commerical,
        residential,
        industrial,
        land,
      });

      // update Storage Cache
      payload = JSON.stringify(payload);
      await AsyncStorage.setItem("agency", JSON.stringify(res));
    }
  };

  const uploadLogoFromPhone = async () => {
    let token = await AsyncStorage.getItem("jwt");
    const newfile = await uploadImageFromPhone();
    console.error("NEW FILE", newfile);
    if (newfile) {
      const res = await uploadLogoToCloudinary(newfile);
      // console.log(res);
      if (res) {
        // setUploadLogo(res);
        const sendData = {
          id: profile.id,
          public_id: res.public_id,
          secure_url: res.url,
        };

        // console.log(sendData);
        const data = await uploadLogoUpdate(
          sendData,
          token,
          profile.logo.public_id
        );
        console.error("DATA", data);
        if (data) {
          dispatch(updateProfile(data));
          dispatchProfile({
            profile: data,
            commerical,
            residential,
            industrial,
            land,
          });
          await AsyncStorage.setItem("agency", JSON.stringify(data));
        }
        // dispatch({ type: UPDATEAGENCYPROFILE, payload: data });
      }
    }
  };

  // Side Effects
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#a2d0c1" },
      headerTintColor: "#a2d0c1",
      title: "Account",
      headerRight: () => (
        <TouchableOpacity onPress={logout}>
          <AntIcon
            style={{ verticalAlign: "middle", marginRight: 15 }}
            name="logout"
            color={"#a2d0c1"}
            size={30}
          />
        </TouchableOpacity>
      ),
    });

    const getAgency = () => {
      // setUser(agency.email);
      // setBio(agency.bio);
      // setLogo(agency.logo);
      // setAgencyId(agency.id);
      // setLocations(agency.location);

      dispatchProfile({
        profile: agency,
        commerical: agency.commerical?.length,
        residential: agency.residential?.length,
        industrial: agency.industrial?.length,
        land: agency.land?.length,
      });
      console.log(profile, agency);
    };
    getAgency();

    return () => {
      dispatchProfile(initialState);
    };
  }, [agency]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ProfileCard
        setShowModal={setShowModal}
        editAgency={editAgency}
        logo={profile.logo}
        bio={profile.bio}
        user={profile.email}
        locations={profile.location}
        commerical={commerical}
        residential={residential}
        industrial={industrial}
        land={land}
      />

      <CustomModal
        chosenLocations={chosenLocations}
        showModal={showModal}
        logo={profile?.logo}
        uploadLogoFromPhone={uploadLogoFromPhone}
        editBio={editBio}
        setShowModal={setShowModal}
        storeUserInfo={storeUserInfo}
        setEditBio={setEditBio}
        setChosenLocations={setChosenLocations}
      />
    </ScrollView>
  );
};

export default AgencyProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eff7e1",
  },
  font: {
    fontFamily: "EBGaramond-Regular",
    color: "#214151",
  },
  text: {
    color: "#214151",
  },
});

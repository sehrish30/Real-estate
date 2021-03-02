import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntIcon from "react-native-vector-icons/AntDesign";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, fillStore } from "../../Redux/Actions/auth";
import { UPDATEAGENCYPROFILE } from "../../Redux/constants";

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

const AgencyProfile = ({ navigation }) => {
  // States
  const [user, setUser] = useState("");
  const [bio, setBio] = useState("");
  const [logo, setLogo] = useState({});
  const [editBio, setEditBio] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [uploadLogo, setUploadLogo] = useState({});
  const [agencyId, setAgencyId] = useState(null);
  const [locations, setLocations] = useState([]);
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
      navigation.navigate("Home");
    } catch (e) {
      console.error(e);
    }
  };

  const editAgency = () => {
    setEditBio(bio);
    setShowModal(true);
  };

  const storeUserInfo = async () => {
    let token = await AsyncStorage.getItem("jwt");
    let res;

    if (chosenLocations.length === 0) {
      res = await editAgencyProfile(
        { bio: editBio, id: agencyId, location: locations },
        token
      );
    } else {
      let locationItems;
      locationItems = chosenLocations.map((location) => location.item);
      res = await editAgencyProfile(
        { bio: editBio, id: agencyId, location: locationItems },
        token
      );
      setChosenLocations([]);
    }

    if (res) {
      setBio(editBio);
      setLocations(res.data.location);
      // Update store
      let payload = { ...agency, bio: editBio, location: res.data.location };
      dispatch({ type: UPDATEAGENCYPROFILE, payload });

      // update Storage Cache
      payload = JSON.stringify(payload);
      await AsyncStorage.setItem("agency", payload);
    }
  };

  const uploadLogoFromPhone = async () => {
    let token = await AsyncStorage.getItem("jwt");
    const newfile = await uploadImageFromPhone();

    const res = await uploadLogoToCloudinary(newfile);

    console.log(res);
    if (res) {
      setUploadLogo(res);
      const sendData = {
        id: agencyId,
        public_id: res.public_id,
        secure_url: res.url,
      };
      console.log(sendData)
      const data = await uploadLogoUpdate(sendData, token, logo.public_id);
      console.log("HIDE", data);
      dispatch(fillStore({ agency: data }));
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
      setUser(agency.email);
      setBio(agency.bio);
      setLogo(agency.logo);
      setAgencyId(agency.id);
      setLocations(agency.location);
    };
    getAgency();
  }, [navigation, logout]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ProfileCard
        setShowModal={setShowModal}
        setEditBio={setEditBio}
        editAgency={editAgency}
        logo={logo?.url}
        bio={bio}
        user={user}
        locations={locations}
      />
      <CustomModal
        chosenLocations={chosenLocations}
        showModal={showModal}
        logo={logo}
        uploadLogoFromPhone={uploadLogoFromPhone}
        editBio={editBio}
        setShowModal={setShowModal}
        storeUserInfo={storeUserInfo}
        setEditBio={setEditBio}
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

import React, { useLayoutEffect, useState, useReducer } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
} from "react-native";
import { Button, Card, Image } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntIcon from "react-native-vector-icons/AntDesign";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, updateProfile } from "../../Redux/Actions/auth";
import { FontAwesome5 } from "@expo/vector-icons";

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
import CustomModalPassword from "../../Shared/Input/CustomModalPassword";
var { width, height } = Dimensions.get("screen");
// Reducers State
const reducer = (state, newState) => ({ ...state, ...newState });
const initialState = {
  profile: {},
  commercial: 0,
  land: 0,
  residential: 0,
  industrial: 0,
};

const AgencyProfile = ({ navigation }) => {
  // REDUCERS
  const [
    { profile, commercial, land, residential, industrial },
    dispatchProfile,
  ] = useReducer(reducer, initialState);

  // States
  const [editBio, setEditBio] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [chosenLocations, setChosenLocations] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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
    console.error("HEHE");

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
        commercial,
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

        if (data) {
          dispatch(updateProfile(data));
          dispatchProfile({
            profile: data,
            commercial,
            residential,
            industrial,
            land,
          });

          await AsyncStorage.setItem("agency", JSON.stringify(data));
        }
      }
    }
  };

  const changePassword = () => {
    setShowPasswordModal(true);
  };

  // Side Effects
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#eff7e1" },
      headerTitleStyle: { color: "#2c6e8f", fontSize: 16 },
      headerTintColor: "#2c6e8f",
      title: "Account",
      headerRight: () => (
        <TouchableOpacity onPress={logout}>
          <AntIcon
            style={{ marginRight: 15 }}
            name="logout"
            color={"#a2d0c1"}
            size={30}
          />
        </TouchableOpacity>
      ),
    });

    const getAgency = () => {
      dispatchProfile({
        profile: agency,
        commercial: agency.commercial?.length,
        residential: agency.residential?.length,
        industrial: agency.industrial?.length,
        land: agency.land?.length,
      });
      console.log(profile, agency.commercial);
      // console.error(profile.id);
    };
    getAgency();

    return () => {
      dispatchProfile(initialState);
    };
  }, [agency]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ProfileCard
        navigation={navigation}
        setShowModal={setShowModal}
        editAgency={editAgency}
        logo={profile.logo}
        bio={profile.bio}
        user={profile.email}
        locations={profile.location}
        commercial={commercial}
        residential={residential}
        industrial={industrial}
        land={land}
        showEditbutton={true}
        changePassword={changePassword}
        id={profile.id}
        name={profile.name}
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
      <CustomModalPassword
        showPasswordModal={showPasswordModal}
        setShowPasswordModal={setShowPasswordModal}
        changePassword={changePassword}
        agencyId={profile.id}
        navigation={navigation}
        dispatchProfile={dispatchProfile}
      />

      {/* <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: width,
          marginVertical: 10,
        }}
      >
        <Button
          icon={
            <FontAwesome5
              style={{ marginRight: 5 }}
              name="building"
              size={24}
              color="#e4fbff"
            />
          }
          title="View Properties"
          onPress={() => {
            navigation.navigate("AgencyListings");
          }}
          titleStyle={styles.titlebtn}
          buttonStyle={{
            backgroundColor: "#214151",
            width: width / 1.08,
          }}
        />
      </View> */}
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
  property: {
    backgroundColor: "white",
    borderRadius: 5,
  },
  titlebtn: {
    fontFamily: "EBGaramond-Bold",
    color: "#e4fbff",
  },
});

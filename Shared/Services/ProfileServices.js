import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import jwt_decode from "jwt-decode";
// import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export async function editAgencyProfile(data, token) {
  try {
    const res = await axios.put(`${baseURL}agencies/edit-agency`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.statusText == "OK") {
      Toast.show({
        type: "success",
        text1: `Profile updated`,
        visibilityTime: 2000,
        topOffset: 30,
      });
      return res;
    }
  } catch (e) {
    console.error(e);
    Toast.show({
      type: "error",
      text1: `Couldn't update profile`,
      text2: `Try again`,
      visibilityTime: 4000,
      topOffset: 30,
    });
  }
}
export async function uploadLogoUpdate(data, token, imageId) {
  try {
    const res = await axios.put(`${baseURL}agencies/upload-logo`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.statusText == "OK") {
      await axios.delete(
        `${baseURL}agencies/delete-image`,
        { imageId },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      return res;
    }
  } catch (e) {
    console.error(e);
  }
}

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export async function consultationRequest(data, token) {
  try {
    const res = await axios.post(
      `${baseURL}consultations/customer-requesting-consultation`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status == 200 || res.status == 201) {
      Toast.show({
        type: "success",
        text1: `Consultation session requested`,
        text2: `We will notify you agency's response`,
        visibilityTime: 4000,
        topOffset: 30,
      });
      return res.data;
    } else if (res.status == 404) {
      Toast.show({
        type: "error",
        text1: `Consultation couldn't be sent`,
        text2: `Try again`,
        visibilityTime: 4000,
        topOffset: 30,
      });
    } else {
      Toast.show({
        type: "info",
        text1: `Our servers are down`,
        text2: `Try again`,
        visibilityTime: 4000,
        topOffset: 30,
      });
    }
  } catch (err) {
    console.error(err);
  }
}

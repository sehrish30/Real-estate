import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

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
    if (res.status == 200) {
      Toast.show({
        type: "success",
        text1: `Profile updated`,
        visibilityTime: 2000,
        topOffset: 30,
      });

      return res.data;
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

    if (res.status == 200) {
      const doneOrNOt = await axios.delete(`${baseURL}agencies/delete-image`, {
        data: { imageId },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("WHAT", doneOrNOt);
      return res.data;
    }
  } catch (e) {
    console.error(e);
  }
}

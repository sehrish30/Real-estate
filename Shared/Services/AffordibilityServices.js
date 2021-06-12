import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import { StatusBar } from "react-native";
export async function getAffordibility() {
  try {
    const result = await axios.get(`${baseURL}affordibility/get`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (result.status == 200 || result.status == 201) {
      return result.data;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function postAffordibility(data, token) {
  console.error(token, data);
  try {
    const result = await axios.post(`${baseURL}affordibility/postAdmin`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (result.status == 200 || result.status == 201) {
      Toast.show({
        type: "success",
        text1: ` Recommendation Updated`,
        visibilityTime: 2000,
        topOffset: StatusBar.currentHeight + 10,
      });
      return result.data;
    }
  } catch (err) {
    console.error(err);
  }
}

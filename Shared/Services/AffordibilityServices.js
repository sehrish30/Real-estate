import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

export async function getAffordibility(token) {
  try {
    const result = await axios.get(`${baseURL}affordibility/get`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
  try {
    const result = await axios.get(`${baseURL}affordibility/postAdmin`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (result.status == 200 || result.status == 201) {
      return result.data;
    }
  } catch (err) {
    console.error(err);
  }
}

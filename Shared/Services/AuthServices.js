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

export async function loginUser(data) {
  try {
    const res = await axios.post(`${baseURL}users/login`, data, config);

    let sendData = {};
    if (res.status == 200) {
      Toast.show({
        type: "success",
        text1: `${res.data.email} successfully logged in`,
        visibilityTime: 2000,
        topOffset: 30,
      });
      //   await SecureStore.setItemAsync("jwt", res.data.token);
      await AsyncStorage.setItem("jwt", res.data.token);

      const decoded = jwt_decode(res.data.token);
      sendData = { decoded, ...res.data };
      await AsyncStorage.setItem("user", JSON.stringify(sendData));
      //   dispatch(setCurrentUser(decoded, user));
    }
    return sendData;
  } catch (err) {
    console.log(err);
  }
}

export async function registerUser(data) {
  try {
    const res = await axios.post(`${baseURL}users/register`, data, config);
    const user = await loginUser({
      email: res.data.email,
      password: data.password,
    });
    return user;
  } catch (e) {
    console.err(r);
    Toast.show({
      type: "error",
      text1: `Some error has occurred`,
      visibilityTime: 2000,
      topOffset: 30,
    });
  }
}

export async function checkUser(id, token) {
  const res = await axios.get(`${baseURL}users/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.status == 200;
}

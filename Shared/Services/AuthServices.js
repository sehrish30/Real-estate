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
      await AsyncStorage.setItem("isLoggedIn", "true");
      //   dispatch(setCurrentUser(decoded, user));
    }
    return sendData;
  } catch (err) {
    console.log(err);
  }
}

export async function loginGoogleUser(data) {
  try {
    const res = await axios.post(`${baseURL}users/google-login`, data, config);

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
      await AsyncStorage.setItem("isLoggedIn", "true");
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
    console.err(e);
    Toast.show({
      type: "error",
      text1: `Some error has occurred`,
      visibilityTime: 2000,
      topOffset: 30,
    });
  }
}

export async function registerGoogleUser(data) {
  console.error(data);
  try {
    const res = await axios.post(
      `${baseURL}users/google-register`,
      data,
      config
    );
    console.error("RESPONSe", res);
    const user = await loginGoogleUser({
      email: res.data.email,
    });
    return user;
  } catch (e) {
    console.err(e);
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

export async function forgotUser(data) {
  try {
    const res = await axios.post(
      `${baseURL}users/reset-password`,
      data,
      config
    );
    if (res.status == 200) {
      Toast.show({
        type: "success",
        text1: `Check your email for code`,
        visibilityTime: 4000,
        topOffset: 30,
      });
      return res;
    }
  } catch (e) {
    Toast.show({
      type: "error",
      text1: `Email incorrect`,
      text2: `Make sure email is registered`,
      visibilityTime: 4000,
      topOffset: 30,
    });
  }
}

export async function resetUserPassword(data, token) {
  try {
    const res = await axios.post(`${baseURL}users/enter-password`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status == 200) {
      Toast.show({
        type: "success",
        text1: `You successfully changed your password`,
        text2: `Login to proceed`,
        visibilityTime: 4000,
        topOffset: 30,
      });
    }
  } catch (err) {
    console.error(err);
    Toast.show({
      type: "error",
      text1: `Some error occured try again`,
      text2: `${err}`,
      visibilityTime: 4000,
      topOffset: 30,
    });
  }
}

export async function loginAgencySrv(data, navigation) {
  try {
    const res = await axios.post(`${baseURL}agencies/login`, data, config);
    if (res.status == 200) {
      Toast.show({
        type: "success",
        text1: `Successfully logged in`,
        visibilityTime: 2000,
        topOffset: 30,
      });
      navigation.navigate("Home");
      return res;
    } else {
      Toast.show({
        type: "error",
        text1: `${err}`,
        visibilityTime: 2000,
        topOffset: 30,
      });
    }
  } catch (err) {
    Toast.show({
      type: "error",
      text1: `Email or password incorrect`,
      visibilityTime: 2000,
      topOffset: 30,
    });
    console.error(err);
  }
}

export async function changeAgencyPassword(data, token) {
  try {
    const res = await axios.put(`${baseURL}agencies/change-password`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status == 200 || res.status == 201) {
      console.error("HERE", res.data);
      return res.data;
    }
  } catch (err) {
    console.error(err);
    Toast.show({
      type: "error",
      text1: `Password incorrect`,
      text2: `Try again`,
      visibilityTime: 2000,
      topOffset: 30,
    });
  }
}

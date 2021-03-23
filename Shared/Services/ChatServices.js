import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

// import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export async function checkChatExists(data) {
  try {
    console.log("DATA", data);

    const res = await axios.get(
      `${baseURL}chats/check-chat`,
      {
        params: data,
      },
      config
    );
    if (res.status == 200) {
      return res.data;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function createChat(data, token) {
  try {
    const res = await axios.post(`${baseURL}chats/createchat`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status == 200) {
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function agencyRooms(data, token) {
  try {
    const res = await axios({
      method: "get",
      url: `${baseURL}chats/all-agencychatrooms`,
      params: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status == 200 || res.status == 304) {
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function customerRooms(data, token) {
  try {
    const res = await axios.get(`${baseURL}chats/all-chatrooms`, {
      params: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status == 200 || res.status == 304) {
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function fetchAllChats(data, token) {
  console.log("TOKEN I AM GETTING", token);
  try {
    const res = await axios.get(`${baseURL}chats/all-chats`, {
      params: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status == 200 || res.status == 304) {
      console.log("REPONSE HERE", res.data);
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}
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
  console.log("TOKEN I AM GETTING", data);
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

export async function sendChat(data, token) {
  try {
    const res = await axios.post(`${baseURL}chats/send`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status == 200 || res.status == 201) {
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function seenChat(data, token) {
  try {
    const res = await axios.put(`${baseURL}chats/all-chatsSeen`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status == 200 || res.status == 201) {
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function deleteChat(chatMsgId, chatId, token) {
  try {
    const res = await axios.delete(
      `${baseURL}chats/delete-chat/${chatMsgId}/${chatId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status == 200 || res.status == 201) {
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function blockChat(id, personWhoBlocked, token) {
  try {
    const res = await axios.delete(
      `${baseURL}chats/block-chatroom/${id}/${personWhoBlocked}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status == 200 || res.status == 201) {
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function unblockChat(data, token) {
  try {
    const res = await axios.post(`${baseURL}chats/unblock-chat`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status == 200 || res.status == 201) {
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
}

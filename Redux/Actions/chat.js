import { checkChatExists } from "../../Shared/Services/ChatServices";

import {
  CHAT_EXISTS,
  USER_ONLINE,
  USER_OFFLINE,
  ALL_CHATS,
} from "../constants";

export const chectChatExistAction = (data) => (dispatch) => {
  checkChatExists(data)
    .then((res) => {
      console.log("RESPONSE ACTION", res);
      dispatch({ type: CHAT_EXISTS, payload: res });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const userOnline = () => (dispatch) => {
  dispatch({ type: USER_ONLINE });
};

export const userOffline = () => (dispatch) => {
  dispatch({ type: USER_OFFLINE });
};

export const allChats = (data) => (dispatch) => {
  dispatch({ type: ALL_CHATS, payload: data });
};

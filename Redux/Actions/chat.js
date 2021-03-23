import { checkChatExists } from "../../Shared/Services/ChatServices";

import {
  CHAT_EXISTS,
  USER_ONLINE,
  USER_OFFLINE,
  ALL_CHATS,
  FRIENDS_ONLINE,
  FRIEND_ONLINE,
  SET_CHATS,
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

export const userOffline = (userId) => (dispatch) => {
  console.log("OKAY RELAX I AM DISPATCHING", userId);
  dispatch({ type: USER_OFFLINE, payload: userId });
};

export const allChats = (data) => (dispatch) => {
  dispatch({ type: ALL_CHATS, payload: data });
};

export const online = (userId) => (dispatch) => {
  dispatch({ type: FRIEND_ONLINE, payload: userId });
};

export const getChats = (chats) => (dispatch) => {
  dispatch({ type: SET_CHATS, payload: chats });
};

export const onlineFriends = (friends) => (dispatch) => {
  dispatch({ type: FRIENDS_ONLINE, payload: friends });
};

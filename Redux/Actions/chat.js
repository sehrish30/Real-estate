import { checkChatExists } from "../../Shared/Services/ChatServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CHAT_EXISTS,
  USER_ONLINE,
  USER_OFFLINE,
  ALL_CHATS,
  FRIENDS_ONLINE,
  FRIEND_ONLINE,
  SET_CHATS,
  SENDER_TYPING,
  SET_SOCKET,
  STOP_TYPING,
  SET_CURRENT_CHAT,
  SET_MESSAGE,
  SET_ALL_MESSAGES,
  SET_SEEN_MESSAGE,
  DELETE_CHAT,
  BLOCK_CHAT,
  UNBLOCK_CHAT,
  FETCH_CHATS,
  EDIT_FETCH_CHATS,
  FETCH_CHAT_SEEN,
  NOTIFICATIONS_CHATS,
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
  console.log("GET CHATS", chats);
  dispatch({ type: SET_CHATS, payload: chats });
};

export const onlineFriends = (friends) => (dispatch) => {
  dispatch({ type: FRIENDS_ONLINE, payload: friends });
};

export const userTyping = (userId) => (dispatch) => {
  dispatch({ type: SENDER_TYPING, payload: userId });
};

export const setSocket = (socket) => async (dispatch) => {
  dispatch({ type: SET_SOCKET, payload: socket });
};

export const stopTyping = (userId) => (dispatch) => {
  dispatch({ type: STOP_TYPING, payload: userId });
};

export const currentChat = (chatId) => (dispatch) => {
  dispatch({ type: SET_CURRENT_CHAT, payload: chatId });
};

export const addToMessages = (chat) => (dispatch) => {
  dispatch({ type: SET_MESSAGE, payload: chat });
};

export const setallMessages = (messages) => (dispatch) => {
  dispatch({ type: SET_ALL_MESSAGES, payload: messages });
};

export const setseenMessage = (chat) => (dispatch) => {
  dispatch({ type: SET_SEEN_MESSAGE, payload: chat });
};

export const deletechat = (chat) => (dispatch) => {
  dispatch({ type: DELETE_CHAT, payload: chat });
};

export const blockChat = (chat) => (dispatch) => {
  dispatch({ type: BLOCK_CHAT, payload: chat });
};

export const chatunblock = (chat) => (dispatch) => {
  dispatch({ type: UNBLOCK_CHAT, payload: chat });
};

export const fetchAllChats = (chat) => (dispatch) => {
  dispatch({ type: FETCH_CHATS, payload: chat });
};

export const addToFetchedChats = (chat) => (dispatch) => {
  console.log("ACTION HERE", chat);
  dispatch({ type: EDIT_FETCH_CHATS, payload: chat });
};

export const fetchChatsSeen = (chatId) => (dispatch) => {
  dispatch({ type: FETCH_CHAT_SEEN, payload: chatId });
};

export const sendChatNotifications = (payload) => (dispatch) => {
  dispatch({ type: NOTIFICATIONS_CHATS, payload });
};

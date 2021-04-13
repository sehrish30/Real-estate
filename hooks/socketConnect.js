import React, { useEffect } from "react";
import baseURL from "../assets/common/baseUrl";
import socketIOClient from "socket.io-client";
import * as actions from "../Redux/Actions/chat";
import * as notifyActions from "../Redux/Actions/consultation";
import store from "../Redux/store";

export function useSocket(user, dispatch) {
  const ENDPOINT = baseURL;

  const socket = socketIOClient(ENDPOINT);

  let socketStored = store.getState().chat.socket;
  console.log("MAR TO", socketStored);
  if (Object.keys(socketStored).length === 0) {
    socket.emit("join", user);
  }
  let chatsStored = store.getState().chat.chats;

  if (user.allChats) {
    dispatch(actions.fetchAllChats(user.allChats));
    dispatch(actions.getChats(user.allChats));
  }

  dispatch(actions.setSocket(socket));

  socket.on("roomData", (data) => {
    console.log(data, "HAYE");
    dispatch(actions.online(data));
  });

  socket.on("offline", (userId) => {
    dispatch(actions.userOffline(userId));
  });

  socket.on("happy", (userId) => {
    console.log("HAPPY", userId);
  });

  socket.on("friends", (onlineFriends) => {
    dispatch(actions.onlineFriends(onlineFriends));
  });

  socket.on("typing", (userId) => {
    console.log(userId, "SOMEBODY IS TYPING");
    dispatch(actions.userTyping(userId));
  });

  socket.on("stoppedTyping", (userId) => {
    dispatch(actions.stopTyping(userId));
  });

  socket.on("newMessage", (message) => {
    console.log("WHAT I AM GETTING ON SENDING MESSAGEs", message);
    dispatch(actions.addToMessages({ ...message }));
  });

  socket.on("delMessage", (message) => {
    dispatch(actions.deletechat(message));
  });

  socket.on("chatBlocked", (chat) => {
    dispatch(actions.blockChat(chat));
  });

  socket.on("chatunblock", (chat) => {
    dispatch(actions.chatunblock(chat));
  });

  socket.on("newChat", (chat) => {
    dispatch(actions.addToFetchedChats(chat));
  });

  socket.on("notifyConsultationRequest", (data) => {
    dispatch(notifyActions.requestConsultation(data));
  });

  socket.on("declineNotification", (data) => {
    dispatch(notifyActions.decline(data));
  });

  socket.connect;
}

import React, { useEffect } from "react";
import baseURL from "../assets/common/baseUrl";
import socketIOClient from "socket.io-client";
import * as actions from "../Redux/Actions/chat";

export function useSocket(user, dispatch) {
  const ENDPOINT = baseURL;

  const socket = socketIOClient(ENDPOINT);
  dispatch(actions.getChats(user.allChats));
  dispatch(actions.setSocket(socket));

  socket.emit("join", user);

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
  socket.connect;
}

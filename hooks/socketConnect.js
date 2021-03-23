import React, { useEffect } from "react";

import socketIOClient from "socket.io-client";
import * as actions from "../Redux/Actions/chat";

export function useSocket(user, dispatch) {
  dispatch(actions.getChats(user.allChats));
  const ENDPOINT = "localhost:3000";

  const socket = socketIOClient(ENDPOINT);
  socket.emit("join", user);

  socket.on("typing", (user) => {
    console.log("EVENT", user);
  });

  socket.on("roomData", (data) => {
    console.log(data, "HAYE");
    dispatch(actions.online(data));
  });

  socket.on("offline", (userId) => {
    console.log(userId);
    dispatch(actions.userOffline(userId));
  });

  socket.on("happy", (userId) => {
    console.log("HAPPY", userId);
  });

  socket.on("friends", (onlineFriends) => {
    console.log(onlineFriends, "UFFF");
    dispatch(actions.onlineFriends(onlineFriends));
  });
}

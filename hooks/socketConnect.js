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
  });

  socket.on("online", (userId) => {
    console.log("USER STATUS TO UPDATE IN REDUX", userId);
    dispatch(actions.online(userId));
  });
}

import React, { useEffect } from "react";

import socketIOClient from "socket.io-client";

export function useSocket(user, dispatch) {
  console.log(user);
  const ENDPOINT = "localhost:3000";

  const socket = socketIOClient(ENDPOINT);
  socket.emit("join", user);

  socket.on("typing", (user) => {
    console.log("EVENT", user);
  });

  socket.on("roomData", (data) => {
    console.log(data, "HHAYE");
  });
}

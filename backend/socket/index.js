const socketio = require("socket.io");

const SocketServer = (server) => {
  const io = socketio(server, {
    cors: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionSuccessStatus: 204,
    },
  });

  io.on("connection", (socket) => {
    console.log("REACHED");
    let sockets = [];

    socket.on("join", async (user) => {
      // keep track of all users that join our app
      socket.join("room");

      // check which users are present in our app
      io.to("room").emit("roomData", {
        ...user,
        room: "room",
      });

      console.log(user, "OOYE");
    });

    io.to(socket.id).emit("typing", "Usee typing...");

    // socket.on("disconnect", () => {
    //   // remove user when disconnected
    //   console.log("User had left");
    // });
    socket.on("disconnect", function () {
      // io.socket.removeAllListeners();
      console.log("USER LEFT");
      // socket.removeAllListeners("room");
      // socket.removeAllListeners("disconnect");
      io.removeAllListeners("connection");
    });
  });
};

module.exports = SocketServer;

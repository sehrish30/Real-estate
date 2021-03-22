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

  const getChatters = async (userId, allChats) => {
    let friendchatters = [];

    for (chat of allChats) {
      friendchatters.push(chat.agencyId);
    }
    return friendchatters;
  };

  // collection
  const users = new Map();
  const userSockets = new Map();

  io.on("connection", (socket) => {
    console.log("REACHED");
    let sockets = [];
    let userId;
    socket.on("join", async (user) => {
      console.log("THTs why i am showing error", user);
      // we want to know all users online to inform them about his precense
      userId = user.user.decoded.userId;

      /*-----------------------------------------
            SETTING USER AND HIS SOCKETS
        ---------------------------------------- */
      if (users.has(userId)) {
        // get list of all users sockets
        const existingUser = users.get(userId);

        // Update user sockets with the ones already saved with the ones connecting with
        existingUser.sockets = [...existingUser.sockets, ...[socket.id]];
        users.set(userId, existingUser);
        sockets = [...existingUser.sockets, ...[socket.id]];
        userSockets.set(socket.id, userId);
      } else {
        // no user so set new user
        // sockets array to know user can have multiple sockets if he opens app from multiple browsers etc
        users.set(userId, { id: userId, sockets: [socket.id] });
        sockets.push(socket.id);
        userSockets.set(socket.id, userId);
      }

      /*-----------------------------------------
            GETTING ALL FRIENDS ONLINE
        ---------------------------------------- */
      const onlineFriends = [];

      // check which of users friends are online

      const chatters = await getChatters(userId, user.allChats);

      console.log("ALL ONLINE FRIENDs", chatters);
      for (let i = 0; i < chatters.length; i++) {
        if (users.has(chatters[i])) {
          // get the chatter socket and id
          const chatter = users.get(chatters[i]);
          // loop over his sockets and broadcast other users about his precense
          chatter.sockets.forEach((socket) => {
            // send message to all of his friends
            try {
              socket.broadcast.emit("online", user.user.decoded.userId);
            } catch (er) {}
          });
          // Now send user all his online friends
          onlineFriends.push(chatter.id);
          console.log("ONLINEFRINDS", onlineFriends);

          // Now send my sockets all online friends
          sockets.forEach((socket) => {
            try {
              io.to(socket).emit("friends", onlineFriends);
            } catch (err) {}
          });
        }
      }

      // keep track of all users that join our app
      socket.join("room");

      // check which users are present in our app
      io.to("room").emit("roomData", userSockets.get(socket.id));

      // console.log(user, "OOYE");
      console.log(users.get(userId));
      console.log(userSockets.get(socket.id));
    });

    io.to(socket.id).emit("typing", "Usee typing...");

    /*-----------------------------------------
             User typing
    ---------------------------------------- */
    socket.on("typing", (message) => {
      // We will see which user is getting the message
      message.toUserId.forEach((id) => {
        if (users.has(id)) {
          users.get(id).sockets.forEach((socket) => {
            io.to(socket).emit("typing", message);
          });
        }
      });
    });

    /*-----------------------------------------
             User Disconnected
    ---------------------------------------- */

    // socket.on("disconnect", () => {
    //   // remove user when disconnected
    //   console.log("User had left");
    // });
    socket.on("disconnect", async () => {
      console.log("USER LEFT");
      if (userSockets.has(socket.id)) {
        const user = users.get(userSockets.get(socket.id));

        // checking if user has multiple sockets
        if (user.sockets.length > 1) {
          user.sockets = user.sockets.filter((sock) => {
            if (sock !== socket.id) return true;
            // Now also update user sockets collection
            userSockets.delete(sock);
            return false;
          });
          // update users collection
          users.set(userId, user);
        } else {
          // notify friends that user left
          const chatters = await getChatters(userId);
          for (let i = 0; i < chatters.length; i++) {
            if (users.has(chatters[i])) {
              // loop over his sockets
              users.get(chatters[i]).sockets.forEach((socket) => {
                // send message to all of his friends that he left
                try {
                  io.to(socket).emit("offline", user);
                } catch (err) {}
              });
            }
          }
          users.delete(userId);
          userSockets.delete(socket.id);
        }
      }
      // io.removeAllListeners("connection");
    });
  });
};

module.exports = SocketServer;

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
    console.log("ALLCHATS", allChats);
    for (chat of allChats) {
      friendchatters.push(chat.searchId);
    }
    return friendchatters;
  };

  // collection
  const users = new Map();
  const userSockets = new Map();

  io.on("connection", (socket) => {
    console.log("SOCKET ON");
    let sockets = [];
    let allChatsOfUser = [];
    let userId;
    socket.on("join", async (user) => {
      allChatsOfUser = user.allChats;
      console.log("USER DATA I AM GETTING", user);
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

      console.log("ALL FRIENDS", chatters);
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
          console.log("ONLINE FRINDS", onlineFriends);

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
      // console.log(userSockets.get(socket.id));
    });

    io.to(socket.id).emit("typing", "Usee typing...");

    /*-----------------------------------------
             User typing
    ---------------------------------------- */

    socket.on("typing", (userId) => {
      // We will see which user is getting the message
      if (users.has(userId)) {
        console.log("USER ID I AM GETTING FOR TYPING", userId);
        users.get(userId).sockets.forEach((socket) => {
          io.to("room").emit("typing", userId);
        });
      }
    });

    socket.on("stoppedTyping", (userId) => {
      // We will see which user is getting the message
      if (users.has(userId)) {
        // console.log("USER ID I AM GETTING FOR TYPING", userId);
        users.get(userId).sockets.forEach((socket) => {
          io.to("room").emit("stoppedTyping", userId);
        });
      }
    });

    /*-----------------------------------------
             Message sent
    ---------------------------------------- */

    socket.on("newMessage", async (message) => {
      console.log("I AM HELPLESS");
      console.log(
        "I AM SENDING TO ORIGINAL USE REXCUSE ME",
        users.has(message.author),
        users.has(message.toUserId),
        message.author,
        message.toUserId
      );
      // send the message to receiver socket
      if (users.has(message.toUserId)) {
        console.log("USER ID I AM GETTING FOR CHAT", message);
        users.get(message.toUserId).sockets.forEach((socket) => {
          io.to(socket).emit("newMessage", message);
        });
      }
      // send the message to sender socket
      if (users.has(message.author)) {
        users.get(message.author).sockets.forEach((socket) => {
          io.to(socket).emit("newMessage", message);
        });
      }
    });

    /*-----------------------------------------
             User Disconnected
    ---------------------------------------- */

    // socket.on("disconnect", () => {
    //   // remove user when disconnected
    //   console.log("User had left");
    // });
    socket.on("disconnect", async () => {
      // emit so also delete in frontend

      console.log("USER LEFT");
      if (userSockets.has(socket.id)) {
        const user = users.get(userSockets.get(socket.id));
        console.log("LEFT USER", user);

        // checking if user has multiple sockets
        if (user.sockets.length > 1) {
          user.sockets = user.sockets.filter((sock) => {
            if (sock !== socket.id) return true;
            // Now also update user sockets collection
            userSockets.delete(sock);
            return false;
          });
          // update users collection now one of sockets is deleted
          users.set(userId, user);
        } else {
          // notify friends that user left
          console.log("THIS IS THE PROPBLEM", userId, allChatsOfUser);
          const chatters = await getChatters(userId, allChatsOfUser);
          console.log("I AM GETTING TO REMOVE", chatters);

          for (let i = 0; i < chatters.length; i++) {
            if (users.has(chatters[i])) {
              // loop over his sockets
              users.get(chatters[i]).sockets.forEach((socket) => {
                // send message to all of his friends that he left
                try {
                  // io.to("room").emit("roomData", userSockets.get(socket.id));
                  // io.to(socket).emit("offline", user.id);
                  io.to("room").emit("offline", user.id);
                  console.log("I EMITTED", user.id);
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

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

  const getChatters = async (userId, allChats = []) => {
    let friendchatters = [];
    // console.log("ALLCHATS", allChats);
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
      allChatsOfUser = user.allChats || [];

      // we want to know all users online to inform them about his precense
      if (user.user?.decoded?.userId) {
        userId = user.user.decoded.userId;
      } else {
        userId = user.user.id;
      }

      /*-----------------------------------------
            SETTING USER AND HIS SOCKETS
        ---------------------------------------- */

      if (users.has(userId)) {
        console.log("USER HAS");
        // get list of all users sockets
        const existingUser = users.get(userId);

        // Update user sockets with the ones already saved with the ones connecting with
        existingUser.sockets = [...existingUser.sockets, ...[socket.id]];
        users.set(userId, existingUser);
        sockets = [...existingUser.sockets, ...[socket.id]];

        userSockets.set(socket.id, userId);
      } else {
        console.log("USER DOESNOT HAS", userId);
        // no user so set new user
        // sockets array to know user can have multiple sockets if he opens app from multiple browsers etc
        users.set(userId, { id: userId, sockets: [socket.id] });
        sockets.push(socket.id);

        userSockets.set(socket.id, userId);
        console.log("SOCKETS I AM PUSHING", sockets, users.has(userId));
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
      console.log("SOCKET USERS", users.get(userId), socket.id);
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
      // send the message to receiver socket
      if (users.has(message.toUserId)) {
        console.log("CULPRIT");
        console.log("USER ID I AM GETTING FOR CHATNEW ", message);
        users.get(message.toUserId).sockets.forEach((socket) => {
          io.to(socket).emit("newMessage", message);
        });
      }
      // send the message to sender socket
      if (users.has(message.author)) {
        console.log("USER ID I AM GETTING FOR CHATNEW ", message);
        users.get(message.author).sockets.forEach((socket) => {
          console.log("CULPRIT");
          io.to(socket).emit("newMessage", message);
        });
      }
    });

    /*-----------------------------------------
             Message deleted
    ---------------------------------------- */

    socket.on("delMessage", async (message) => {
      console.log("USER NOT ONLINE ID I AM GETTING FOR DELETED", message);
      // send the message to receiver socket
      if (users.has(message.toUserId)) {
        console.log("USER ID I AM GETTING FOR DELETED", message);
        users.get(message.toUserId).sockets.forEach((socket) => {
          io.to(socket).emit("delMessage", message);
        });
      }
      if (users.has(message.fromUserId)) {
        users.get(message.fromUserId).sockets.forEach((socket) => {
          io.to(socket).emit("delMessage", message);
        });
      }
    });

    /*-----------------------------------------
             Chat blocked
    ---------------------------------------- */
    socket.on("chatBlocked", async (chatdata) => {
      console.log("USER DATA I AM GETTING TO BLOCK", chatdata);

      if (users.has(chatdata.agency)) {
        users.get(chatdata.agency).sockets.forEach((socket) => {
          io.to(socket).emit("chatBlocked", chatdata);
        });
      }
      if (users.has(chatdata.customer)) {
        users.get(chatdata.customer).sockets.forEach((socket) => {
          io.to(socket).emit("chatBlocked", chatdata);
        });
      }
    });

    /*-----------------------------------------
             Chat blocked
    ---------------------------------------- */
    socket.on("chatunblock", async (chatdata) => {
      console.log("USER DATA I AM GETTING TO BLOCK", chatdata);

      if (users.has(chatdata.agency)) {
        users.get(chatdata.agency).sockets.forEach((socket) => {
          io.to(socket).emit("chatunblock", chatdata);
        });
      }
      if (users.has(chatdata.customer)) {
        users.get(chatdata.customer).sockets.forEach((socket) => {
          io.to(socket).emit("chatunblock", chatdata);
        });
      }
    });

    /*-----------------------------------------
             User Created new chat
    ---------------------------------------- */
    socket.on("newChat", async (chatData) => {
      console.log("NEW CHAT COMMON", chatData);
      if (users.has(chatData.toUserId)) {
        users.get(chatData.toUserId).sockets.forEach((socket) => {
          io.to(socket).emit("newChat", chatData.info);
        });
      }
      if (users.has(chatData.fromUserId)) {
        users.get(chatData.fromUserId).sockets.forEach((socket) => {
          io.to(socket).emit("newChat", chatData.info);
        });
      }
    });

    /*-----------------------------------------
           USER SENT CONSULTATION REQUEST
        ---------------------------------------- */
    socket.on("notifyConsultationRequest", async (data) => {
      console.log(data, "WTH I AM GETTING", users.has(data.agency));
      if (users.has(data.agency)) {
        users.get(data.agency).sockets.forEach((socket) => {
          io.to(socket).emit("notifyConsultationRequest", data);
        });
      }
    });

    /*-----------------------------------------
          AGENCY DECLINED CONSULTATION REQUEST
      ---------------------------------------- */
    socket.on("declineNotification", async (data) => {
      console.log(data, "DECLINE NOTIFICATION", users.has(data.customer));
      if (users.has(data.customer)) {
        users.get(data.customer).sockets.forEach((socket) => {
          io.to(socket).emit("declineNotification", data);
        });
      }
    });

    /*-----------------------------------------
          CONSULTATION REQUEST
      ---------------------------------------- */
    socket.on("notification", async (data) => {
      console.log(data, "DECLINE NOTIFICATION", users.has(data.receiver));
      if (users.has(data.receiver)) {
        users.get(data.customer).sockets.forEach((socket) => {
          io.to(socket).emit("notification", data);
        });
      }
    });

    /*-----------------------------------------
          CONSULTATION DELETED
      ---------------------------------------- */
    socket.on("deleteConsultation", async (data) => {
      console.log(data, "DELETE", users.has(data.agencyId));
      if (users.has(data.agencyId)) {
        users.get(data.agencyId).sockets.forEach((socket) => {
          io.to(socket).emit("deleteConsultation", data);
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

      console.log("USER LEFT", socket.id, userSockets.has(socket.id));

      console.log("ALL THE SOCKETS", sockets);
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

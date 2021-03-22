"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var socketio = require("socket.io");

var SocketServer = function SocketServer(server) {
  var io = socketio(server, {
    cors: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionSuccessStatus: 204
    }
  });

  var getChatters = function getChatters(userId, allChats) {
    var friendchatters, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step;

    return regeneratorRuntime.async(function getChatters$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            friendchatters = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 4;

            for (_iterator = allChats[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              chat = _step.value;
              friendchatters.push(chat.agencyId);
            }

            _context.next = 12;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](4);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 12:
            _context.prev = 12;
            _context.prev = 13;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 15:
            _context.prev = 15;

            if (!_didIteratorError) {
              _context.next = 18;
              break;
            }

            throw _iteratorError;

          case 18:
            return _context.finish(15);

          case 19:
            return _context.finish(12);

          case 20:
            return _context.abrupt("return", friendchatters);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[4, 8, 12, 20], [13,, 15, 19]]);
  }; // collection


  var users = new Map();
  var userSockets = new Map();
  io.on("connection", function (socket) {
    console.log("REACHED");
    var sockets = [];
    var userId;
    socket.on("join", function _callee(user) {
      var existingUser, onlineFriends, chatters, i, chatter;
      return regeneratorRuntime.async(function _callee$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              console.log("THTs why i am showing error", user); // we want to know all users online to inform them about his precense

              userId = user.user.decoded.userId;
              /*-----------------------------------------
                    SETTING USER AND HIS SOCKETS
                ---------------------------------------- */

              if (users.has(userId)) {
                // get list of all users sockets
                existingUser = users.get(userId); // Update user sockets with the ones already saved with the ones connecting with

                existingUser.sockets = [].concat(_toConsumableArray(existingUser.sockets), [socket.id]);
                users.set(userId, existingUser);
                sockets = [].concat(_toConsumableArray(existingUser.sockets), [socket.id]);
                userSockets.set(socket.id, userId);
              } else {
                // no user so set new user
                // sockets array to know user can have multiple sockets if he opens app from multiple browsers etc
                users.set(userId, {
                  id: userId,
                  sockets: [socket.id]
                });
                sockets.push(socket.id);
                userSockets.set(socket.id, userId);
              }
              /*-----------------------------------------
                    GETTING ALL FRIENDS ONLINE
                ---------------------------------------- */


              onlineFriends = []; // check which of users friends are online

              _context2.next = 6;
              return regeneratorRuntime.awrap(getChatters(userId, user.allChats));

            case 6:
              chatters = _context2.sent;
              console.log("ALL ONLINE FRIENDs", chatters);

              for (i = 0; i < chatters.length; i++) {
                if (users.has(chatters[i])) {
                  // get the chatter socket and id
                  chatter = users.get(chatters[i]); // loop over his sockets and broadcast other users about his precense

                  chatter.sockets.forEach(function (socket) {
                    // send message to all of his friends
                    try {
                      socket.broadcast.emit("online", user.user.decoded.userId);
                    } catch (er) {}
                  }); // Now send user all his online friends

                  onlineFriends.push(chatter.id);
                  console.log("ONLINEFRINDS", onlineFriends); // Now send my sockets all online friends

                  sockets.forEach(function (socket) {
                    try {
                      io.to(socket).emit("friends", onlineFriends);
                    } catch (err) {}
                  });
                }
              } // keep track of all users that join our app


              socket.join("room"); // check which users are present in our app

              io.to("room").emit("roomData", userSockets.get(socket.id)); // console.log(user, "OOYE");

              console.log(users.get(userId));
              console.log(userSockets.get(socket.id));

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      });
    });
    io.to(socket.id).emit("typing", "Usee typing...");
    /*-----------------------------------------
             User typing
    ---------------------------------------- */

    socket.on("typing", function (message) {
      // We will see which user is getting the message
      message.toUserId.forEach(function (id) {
        if (users.has(id)) {
          users.get(id).sockets.forEach(function (socket) {
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

    socket.on("disconnect", function _callee3() {
      return regeneratorRuntime.async(function _callee3$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              console.log("USER LEFT");

              if (!userSockets.has(socket.id)) {
                _context4.next = 4;
                break;
              }

              _context4.next = 4;
              return regeneratorRuntime.awrap(function _callee2() {
                var user, chatters, i;
                return regeneratorRuntime.async(function _callee2$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        user = users.get(userSockets.get(socket.id)); // checking if user has multiple sockets

                        if (!(user.sockets.length > 1)) {
                          _context3.next = 6;
                          break;
                        }

                        user.sockets = user.sockets.filter(function (sock) {
                          if (sock !== socket.id) return true; // Now also update user sockets collection

                          userSockets["delete"](sock);
                          return false;
                        }); // update users collection

                        users.set(userId, user);
                        _context3.next = 12;
                        break;

                      case 6:
                        _context3.next = 8;
                        return regeneratorRuntime.awrap(getChatters(userId));

                      case 8:
                        chatters = _context3.sent;

                        for (i = 0; i < chatters.length; i++) {
                          if (users.has(chatters[i])) {
                            // loop over his sockets
                            users.get(chatters[i]).sockets.forEach(function (socket) {
                              // send message to all of his friends that he left
                              try {
                                io.to(socket).emit("offline", user);
                              } catch (err) {}
                            });
                          }
                        }

                        users["delete"](userId);
                        userSockets["delete"](socket.id);

                      case 12:
                      case "end":
                        return _context3.stop();
                    }
                  }
                });
              }());

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      });
    });
  });
};

module.exports = SocketServer;
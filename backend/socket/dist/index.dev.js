"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  io.on("connection", function (socket) {
    console.log("REACHED");
    var sockets = [];
    socket.on("join", function _callee(user) {
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // keep track of all users that join our app
              socket.join("room"); // check which users are present in our app

              io.to("room").emit("roomData", _objectSpread({}, user, {
                room: "room"
              }));
              console.log(user, "OOYE");

            case 3:
            case "end":
              return _context.stop();
          }
        }
      });
    });
    io.to(socket.id).emit("typing", "Usee typing...");
  });
};

module.exports = SocketServer;
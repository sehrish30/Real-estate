"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkChatExists = checkChatExists;
exports.createChat = createChat;
exports.agencyRooms = agencyRooms;
exports.customerRooms = customerRooms;
exports.fetchAllChats = fetchAllChats;

var _axios = _interopRequireDefault(require("axios"));

var _baseUrl = _interopRequireDefault(require("../../assets/common/baseUrl"));

var _reactNativeToastMessage = _interopRequireDefault(require("react-native-toast-message"));

var _asyncStorage = _interopRequireDefault(require("@react-native-async-storage/async-storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import * as SecureStore from "expo-secure-store";
var config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};

function checkChatExists(data) {
  var res;
  return regeneratorRuntime.async(function checkChatExists$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log("DATA", data);
          _context.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].get("".concat(_baseUrl["default"], "chats/check-chat"), {
            params: data
          }, config));

        case 4:
          res = _context.sent;

          if (!(res.status == 200)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.data);

        case 7:
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
}

function createChat(data, token) {
  var res;
  return regeneratorRuntime.async(function createChat$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(_baseUrl["default"], "chats/createchat"), data, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer ".concat(token)
            }
          }));

        case 3:
          res = _context2.sent;

          if (!(res.status == 200)) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.data);

        case 6:
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

function agencyRooms(data, token) {
  var res;
  return regeneratorRuntime.async(function agencyRooms$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "get",
            url: "".concat(_baseUrl["default"], "chats/all-agencychatrooms"),
            params: data,
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          }));

        case 3:
          res = _context3.sent;

          if (!(res.status == 200 || res.status == 304)) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.data);

        case 6:
          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

function customerRooms(data, token) {
  var res;
  return regeneratorRuntime.async(function customerRooms$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].get("".concat(_baseUrl["default"], "chats/all-chatrooms"), {
            params: data,
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          }));

        case 3:
          res = _context4.sent;

          if (!(res.status == 200 || res.status == 304)) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.data);

        case 6:
          _context4.next = 11;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

function fetchAllChats(data, token) {
  var res;
  return regeneratorRuntime.async(function fetchAllChats$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log("TOKEN I AM GETTING", token);
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].get("".concat(_baseUrl["default"], "chats/all-chats"), {
            params: data,
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          }));

        case 4:
          res = _context5.sent;

          if (!(res.status == 200 || res.status == 304)) {
            _context5.next = 8;
            break;
          }

          console.log("REPONSE HERE", res.data);
          return _context5.abrupt("return", res.data);

        case 8:
          _context5.next = 13;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](1);
          console.error(_context5.t0);

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 10]]);
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _constants = require("../constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {
  chats: [],
  currentChat: {},
  socket: {},
  newMessage: {
    chatId: null,
    seen: null
  },
  scrollBottom: 0,
  senderTyping: {
    typing: false
  },
  chatExists: false
};

var chat = function chat() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _constants.CHAT_EXISTS:
      return _objectSpread({}, state, {
        chatExists: true
      });

    case _constants.USER_ONLINE:
      var chats = state.chats.Users.map(function (user) {
        if (user.id == payload) {
          return _objectSpread({}, state.chats, {
            status: "online"
          });
        }
      });
      return _objectSpread({}, state, {
        chats: chats
      });

    case _constants.USER_OFFLINE:
      return _objectSpread({}, state, {
        online: false
      });

    case _constants.ALL_CHATS:
      return _objectSpread({}, state, {
        chats: action.payload
      });

    default:
      return state;
  }
};

var _default = chat;
exports["default"] = _default;
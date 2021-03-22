"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChats = exports.online = exports.allChats = exports.userOffline = exports.userOnline = exports.chectChatExistAction = void 0;

var _ChatServices = require("../../Shared/Services/ChatServices");

var _constants = require("../constants");

var chectChatExistAction = function chectChatExistAction(data) {
  return function (dispatch) {
    (0, _ChatServices.checkChatExists)(data).then(function (res) {
      console.log("RESPONSE ACTION", res);
      dispatch({
        type: _constants.CHAT_EXISTS,
        payload: res
      });
    })["catch"](function (err) {
      console.log(err);
    });
  };
};

exports.chectChatExistAction = chectChatExistAction;

var userOnline = function userOnline() {
  return function (dispatch) {
    dispatch({
      type: _constants.USER_ONLINE
    });
  };
};

exports.userOnline = userOnline;

var userOffline = function userOffline() {
  return function (dispatch) {
    dispatch({
      type: _constants.USER_OFFLINE
    });
  };
};

exports.userOffline = userOffline;

var allChats = function allChats(data) {
  return function (dispatch) {
    dispatch({
      type: _constants.ALL_CHATS,
      payload: data
    });
  };
};

exports.allChats = allChats;

var online = function online(userId) {
  return function (dispatch) {
    dispatch({
      type: _constants.FRIEND_ONLINE,
      payload: userId
    });
  };
};

exports.online = online;

var getChats = function getChats(chats) {
  return function (dispatch) {
    dispatch({
      type: _constants.SET_CHATS,
      payload: chats
    });
  };
};

exports.getChats = getChats;
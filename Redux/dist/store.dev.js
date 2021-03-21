"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redux = require("redux");

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var _developmentOnly = require("redux-devtools-extension/developmentOnly");

var _auth = _interopRequireDefault(require("./Reducers/auth"));

var _chat = _interopRequireDefault(require("./Reducers/chat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var reducers = (0, _redux.combineReducers)({
  // user Reducer
  auth: _auth["default"],
  chat: _chat["default"]
});
var store = (0, _redux.createStore)(reducers, (0, _developmentOnly.composeWithDevTools)((0, _redux.applyMiddleware)(_reduxThunk["default"])));
var _default = store;
exports["default"] = _default;
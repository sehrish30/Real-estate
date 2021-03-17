"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginUser = loginUser;
exports.loginGoogleUser = loginGoogleUser;
exports.registerUser = registerUser;
exports.registerGoogleUser = registerGoogleUser;
exports.checkUser = checkUser;
exports.forgotUser = forgotUser;
exports.resetUserPassword = resetUserPassword;
exports.loginAgencySrv = loginAgencySrv;
exports.changeAgencyPassword = changeAgencyPassword;

var _axios = _interopRequireDefault(require("axios"));

var _baseUrl = _interopRequireDefault(require("../../assets/common/baseUrl"));

var _reactNativeToastMessage = _interopRequireDefault(require("react-native-toast-message"));

var _jwtDecode = _interopRequireDefault(require("jwt-decode"));

var _asyncStorage = _interopRequireDefault(require("@react-native-async-storage/async-storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};

function loginUser(data) {
  var res, sendData, decoded;
  return regeneratorRuntime.async(function loginUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(_baseUrl["default"], "users/login"), data, config));

        case 3:
          res = _context.sent;
          sendData = {};

          if (!(res.status == 200)) {
            _context.next = 15;
            break;
          }

          _reactNativeToastMessage["default"].show({
            type: "success",
            text1: "".concat(res.data.email, " successfully logged in"),
            visibilityTime: 2000,
            topOffset: 30
          }); //   await SecureStore.setItemAsync("jwt", res.data.token);


          _context.next = 9;
          return regeneratorRuntime.awrap(_asyncStorage["default"].setItem("jwt", res.data.token));

        case 9:
          decoded = (0, _jwtDecode["default"])(res.data.token);
          sendData = _objectSpread({
            decoded: decoded
          }, res.data);
          _context.next = 13;
          return regeneratorRuntime.awrap(_asyncStorage["default"].setItem("user", JSON.stringify(sendData)));

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(_asyncStorage["default"].setItem("isLoggedIn", "true"));

        case 15:
          return _context.abrupt("return", sendData);

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18]]);
}

function loginGoogleUser(data) {
  var res, sendData, decoded;
  return regeneratorRuntime.async(function loginGoogleUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(_baseUrl["default"], "users/google-login"), data, config));

        case 3:
          res = _context2.sent;
          sendData = {};

          if (!(res.status == 200)) {
            _context2.next = 15;
            break;
          }

          _reactNativeToastMessage["default"].show({
            type: "success",
            text1: "".concat(res.data.email, " successfully logged in"),
            visibilityTime: 2000,
            topOffset: 30
          }); //   await SecureStore.setItemAsync("jwt", res.data.token);


          _context2.next = 9;
          return regeneratorRuntime.awrap(_asyncStorage["default"].setItem("jwt", res.data.token));

        case 9:
          decoded = (0, _jwtDecode["default"])(res.data.token);
          sendData = _objectSpread({
            decoded: decoded
          }, res.data);
          _context2.next = 13;
          return regeneratorRuntime.awrap(_asyncStorage["default"].setItem("user", JSON.stringify(sendData)));

        case 13:
          _context2.next = 15;
          return regeneratorRuntime.awrap(_asyncStorage["default"].setItem("isLoggedIn", "true"));

        case 15:
          return _context2.abrupt("return", sendData);

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 18]]);
}

function registerUser(data) {
  var res, user;
  return regeneratorRuntime.async(function registerUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(_baseUrl["default"], "users/register"), data, config));

        case 3:
          res = _context3.sent;
          _context3.next = 6;
          return regeneratorRuntime.awrap(loginUser({
            email: res.data.email,
            password: data.password
          }));

        case 6:
          user = _context3.sent;
          return _context3.abrupt("return", user);

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.err(_context3.t0);

          _reactNativeToastMessage["default"].show({
            type: "error",
            text1: "Some error has occurred",
            visibilityTime: 2000,
            topOffset: 30
          });

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

function registerGoogleUser(data) {
  var res, user;
  return regeneratorRuntime.async(function registerGoogleUser$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.error(data);
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(_baseUrl["default"], "users/google-register"), data, config));

        case 4:
          res = _context4.sent;
          console.error("RESPONSe", res);
          _context4.next = 8;
          return regeneratorRuntime.awrap(loginGoogleUser({
            email: res.data.email
          }));

        case 8:
          user = _context4.sent;
          return _context4.abrupt("return", user);

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](1);
          console.err(_context4.t0);

          _reactNativeToastMessage["default"].show({
            type: "error",
            text1: "Some error has occurred",
            visibilityTime: 2000,
            topOffset: 30
          });

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 12]]);
}

function checkUser(id, token) {
  var res;
  return regeneratorRuntime.async(function checkUser$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].get("".concat(_baseUrl["default"], "users/").concat(id), {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer ".concat(token)
            }
          }));

        case 2:
          res = _context5.sent;
          return _context5.abrupt("return", res.status == 200);

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
}

function forgotUser(data) {
  var res;
  return regeneratorRuntime.async(function forgotUser$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(_baseUrl["default"], "users/reset-password"), data, config));

        case 3:
          res = _context6.sent;

          if (!(res.status == 200)) {
            _context6.next = 7;
            break;
          }

          _reactNativeToastMessage["default"].show({
            type: "success",
            text1: "Check your email for code",
            visibilityTime: 4000,
            topOffset: 30
          });

          return _context6.abrupt("return", res);

        case 7:
          _context6.next = 12;
          break;

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);

          _reactNativeToastMessage["default"].show({
            type: "error",
            text1: "Email incorrect",
            text2: "Make sure email is registered",
            visibilityTime: 4000,
            topOffset: 30
          });

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 9]]);
}

function resetUserPassword(data, token) {
  var res;
  return regeneratorRuntime.async(function resetUserPassword$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(_baseUrl["default"], "users/enter-password"), data, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer ".concat(token)
            }
          }));

        case 3:
          res = _context7.sent;

          if (res.status == 200) {
            _reactNativeToastMessage["default"].show({
              type: "success",
              text1: "You successfully changed your password",
              text2: "Login to proceed",
              visibilityTime: 4000,
              topOffset: 30
            });
          }

          _context7.next = 11;
          break;

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);

          _reactNativeToastMessage["default"].show({
            type: "error",
            text1: "Some error occured try again",
            text2: "".concat(_context7.t0),
            visibilityTime: 4000,
            topOffset: 30
          });

        case 11:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
}

function loginAgencySrv(data, navigation) {
  var res;
  return regeneratorRuntime.async(function loginAgencySrv$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(_baseUrl["default"], "agencies/login"), data, config));

        case 3:
          res = _context8.sent;

          if (!(res.status == 200)) {
            _context8.next = 8;
            break;
          }

          _reactNativeToastMessage["default"].show({
            type: "success",
            text1: "Successfully logged in",
            visibilityTime: 2000,
            topOffset: 30
          });

          navigation.navigate("Home");
          return _context8.abrupt("return", res);

        case 8:
          _context8.next = 14;
          break;

        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](0);

          _reactNativeToastMessage["default"].show({
            type: "error",
            text1: "Email or password incorrect",
            visibilityTime: 2000,
            topOffset: 30
          });

          console.error(_context8.t0);

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

function changeAgencyPassword(data, token) {
  var res;
  return regeneratorRuntime.async(function changeAgencyPassword$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].put("".concat(_baseUrl["default"], "agencies/change-password"), data, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer ".concat(token)
            }
          }));

        case 3:
          res = _context9.sent;

          if (!(res.status == 200 || res.status == 201)) {
            _context9.next = 7;
            break;
          }

          console.error("HERE", res.data);
          return _context9.abrupt("return", res.data);

        case 7:
          _context9.next = 13;
          break;

        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);

          _reactNativeToastMessage["default"].show({
            type: "error",
            text1: "Password incorrect",
            text2: "Try again",
            visibilityTime: 2000,
            topOffset: 30
          });

        case 13:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 9]]);
}
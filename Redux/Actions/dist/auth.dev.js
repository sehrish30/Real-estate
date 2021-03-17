"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateProfile = exports.loginAgencyAction = exports.logoutUser = exports.fillStore = exports.googleRegister = exports.register = exports.googlelogin = exports.login = void 0;

var _AuthServices = require("../../Shared/Services/AuthServices");

var _constants = require("../constants");

var _reactNativeToastMessage = _interopRequireDefault(require("react-native-toast-message"));

var _asyncStorage = _interopRequireDefault(require("@react-native-async-storage/async-storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var login = function login(data, navigation) {
  return function (dispatch) {
    (0, _AuthServices.loginUser)(data).then(function (res) {
      console.log("RESPONSE ACTION", res);
      dispatch({
        type: _constants.LOGIN,
        payload: res
      });
      navigation.navigate("Home");
    })["catch"](function (err) {
      console.log(err);

      _reactNativeToastMessage["default"].show({
        type: "error",
        text1: "Email or password not correct",
        text2: "Please try again",
        visibilityTime: 2000,
        topOffset: 30
      });
    });
  };
};

exports.login = login;

var googlelogin = function googlelogin(data, navigation) {
  return function (dispatch) {
    console.log("DATA", data);
    (0, _AuthServices.loginGoogleUser)(data).then(function (res) {
      console.log("RESPONSE ACTION", res);
      dispatch({
        type: _constants.LOGIN,
        payload: res
      });
      navigation.navigate("Home");
    })["catch"](function (err) {
      console.log(err);

      _reactNativeToastMessage["default"].show({
        type: "error",
        text1: "Email or password not correct",
        text2: "Please try again",
        visibilityTime: 2000,
        topOffset: 30
      });
    });
  };
};

exports.googlelogin = googlelogin;

var register = function register(data, navigation) {
  return function _callee(dispatch) {
    var res;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap((0, _AuthServices.registerUser)(data));

          case 3:
            res = _context.sent;

            if (res) {
              dispatch({
                type: _constants.LOGIN,
                payload: res
              });
              navigation.navigate("Home");
            }

            _context.next = 11;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);

            _reactNativeToastMessage["default"].show({
              type: "error",
              text1: "Couldn't register user",
              text2: "Please try again",
              visibilityTime: 2000,
              topOffset: 30
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 7]]);
  };
};

exports.register = register;

var googleRegister = function googleRegister(data, navigation) {
  return function _callee2(dispatch) {
    var res;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap((0, _AuthServices.registerGoogleUser)(data));

          case 3:
            res = _context2.sent;

            if (res) {
              dispatch({
                type: _constants.LOGIN,
                payload: res
              });
              navigation.navigate("Home");
            }

            _context2.next = 11;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            console.error(_context2.t0);

            _reactNativeToastMessage["default"].show({
              type: "error",
              text1: "Couldn't register user",
              text2: "Please try again",
              visibilityTime: 2000,
              topOffset: 30
            });

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 7]]);
  };
};

exports.googleRegister = googleRegister;

var fillStore = function fillStore(data) {
  return function _callee3(dispatch) {
    var jwt, user, isLoggedIn, isLoggedInAgency, agency;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            try {
              jwt = data.jwt, user = data.user, isLoggedIn = data.isLoggedIn, isLoggedInAgency = data.isLoggedInAgency, agency = data.agency;
              dispatch({
                type: _constants.FILLSTATE,
                payload: {
                  jwt: jwt,
                  user: user,
                  isLoggedIn: isLoggedIn,
                  isLoggedInAgency: isLoggedInAgency,
                  agency: agency
                }
              });
            } catch (e) {
              console.log(e);
            }

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    });
  };
};

exports.fillStore = fillStore;

var logoutUser = function logoutUser() {
  return function (dispatch) {
    dispatch({
      type: _constants.LOGOUT
    });
  };
};

exports.logoutUser = logoutUser;

var loginAgencyAction = function loginAgencyAction(data) {
  return function (dispatch) {
    dispatch({
      type: _constants.LOGINAGENCY,
      payload: data
    });
  };
};

exports.loginAgencyAction = loginAgencyAction;

var updateProfile = function updateProfile(data) {
  return function (dispatch) {
    dispatch({
      type: _constants.UPDATEAGENCYPROFILE,
      payload: data
    });
  };
};

exports.updateProfile = updateProfile;
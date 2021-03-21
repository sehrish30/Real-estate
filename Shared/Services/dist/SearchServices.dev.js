"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchAgencies = searchAgencies;

var _axios = _interopRequireDefault(require("axios"));

var _baseUrl = _interopRequireDefault(require("../../assets/common/baseUrl"));

var _reactNativeToastMessage = _interopRequireDefault(require("react-native-toast-message"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};

function searchAgencies(name, location) {
  var data, res;
  return regeneratorRuntime.async(function searchAgencies$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(name, location);
          _context.prev = 1;

          if (name && location) {
            data = {
              params: {
                name: name,
                location: location
              }
            };
          } else if (!name && location) {
            data = {
              params: {
                location: location
              }
            };
          } else {
            data = {
              params: {
                name: name
              }
            };
          }

          _context.next = 5;
          return regeneratorRuntime.awrap(_axios["default"].get("".concat(_baseUrl["default"], "agencies"), data, config));

        case 5:
          res = _context.sent;

          if (!(res.status == 200)) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.data);

        case 8:
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](1);
          console.log(_context.t0);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 10]]);
}
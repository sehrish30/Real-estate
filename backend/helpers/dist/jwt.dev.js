"use strict";

// express-jwt used to secure apis
var expressJwt = require("express-jwt");

var authJwt = function authJwt() {
  var secret = process.env.SECRET;
  /* JWT library will disassemble our token
    signed from secret and from our server. It will
    check both. So we can identify user */

  return expressJwt({
    secret: secret,
    algorithms: ["HS256"] // isRevoked,

  }).unless({
    path: [{
      url: /\/agencies(.*)/,
      methods: ["GET", "OPTIONS"]
    }, {
      url: /\/properties(.*)/,
      methods: ["GET", "OPTIONS"]
    }, // { url: /\/users(.*)/, methods: ["GET", "OPTIONS"] },
    "/users/register", "/users/login", "/users/google-register", "/users/google-login", "/users/reset-password", "/agencies/register", "/agencies/login", "/chats/check-chat"]
  });
}; // req e.g req body from frontend
// payload from token and this user is sending me from payload headers
// payload contains data inside token
// e.g I want data like isAdmin which is signed to the user
// which this user is sending me with req headers


function isRevoked(req, payload, done) {
  var url;
  return regeneratorRuntime.async(function isRevoked$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(req.url);
          url = req.url;

          if (!payload.isAdmin) {
            // reject the token if not admin
            done(null, true);
          } // if admin? allow without any parameters


          done();

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}

module.exports = authJwt;
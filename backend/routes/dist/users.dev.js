"use strict";

var _require = require("../models/user.js"),
    User = _require.User;

var express = require("express");

var router = express.Router();

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var nodemailer = require("nodemailer");

var hbs = require("nodemailer-express-handlebars");

var sendinBlue = require("nodemailer-sendinblue-transport");

var transporter = nodemailer.createTransport({
  service: "SendinBlue",
  // no need to set host or port etc.
  auth: {
    user: process.env.SENDINBLUE_USER,
    pass: process.env.SENDINBLUE_PW,
    api: process.env.SENDINBLUE_API
  }
});
transporter.use("compile", hbs({
  viewEngine: "express-handlebars",
  viewPath: "./views/"
}));
/*----------------------------------------
                REGISTER
----------------------------------------- */

router.post("/register", function _callee(req, res) {
  var _req$body, email, dp, passwordHash, user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, email = _req$body.email, dp = _req$body.dp; // hash user password

          passwordHash = bcrypt.hashSync(req.body.password, 14);
          user = new User({
            email: email,
            dp: dp,
            password: passwordHash
          });
          _context.next = 6;
          return regeneratorRuntime.awrap(user.save());

        case 6:
          user = _context.sent;

          if (user) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(400).send("The User couldnot be registered"));

        case 9:
          return _context.abrupt("return", res.send(user));

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: _context.t0
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
/*----------------------------------------
                REGISTER Google User
----------------------------------------- */

router.post("/google-register", function _callee2(req, res) {
  var _req$body2, email, photoUrl, user;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, email = _req$body2.email, photoUrl = _req$body2.photoUrl;
          console.log(email, photoUrl);
          user = new User({
            email: email,
            dp: photoUrl
          });
          _context2.next = 6;
          return regeneratorRuntime.awrap(user.save());

        case 6:
          user = _context2.sent;

          if (user) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(400).send("The User couldnot be registered"));

        case 9:
          return _context2.abrupt("return", res.send(user));

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: _context2.t0
          });

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
/*----------------------------------------
                LOGIN
----------------------------------------- */

router.post("/login", function _callee3(req, res) {
  var user, secret, token;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 3:
          user = _context3.sent;
          secret = process.env.SECRET;

          if (user) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(400).send("No user with this email"));

        case 7:
          if (!(user && bcrypt.compareSync(req.body.password, user.password))) {
            _context3.next = 12;
            break;
          }

          // Generate token for user after user email exists and password matches
          token = jwt.sign({
            userId: user.id,
            isAdmin: user.isAdmin
          }, secret, {
            expiresIn: "15d"
          });
          return _context3.abrupt("return", res.status(200).send({
            email: user.email,
            token: token,
            dp: user.dp
          }));

        case 12:
          return _context3.abrupt("return", res.status(400).send("Wrong Password"));

        case 13:
          _context3.next = 18;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(500).send(_context3.t0));

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
/*----------------------------------------
                Google login
----------------------------------------- */

router.post("/google-login", function _callee4(req, res) {
  var user, secret, token;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 3:
          user = _context4.sent;
          console.log(req.body);

          if (user) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(400).send("No user with this email"));

        case 7:
          secret = process.env.SECRET;
          token = jwt.sign({
            userId: user.id,
            isAdmin: user.isAdmin
          }, secret, {
            expiresIn: "15d"
          });
          return _context4.abrupt("return", res.status(200).send({
            email: user.email,
            dp: user.dp,
            token: token
          }));

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", res.status(500).send(_context4.t0));

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
/*----------------------------------------
            RESET PASSWORD
----------------------------------------- */

router.post("/reset-password", function _callee5(req, res) {
  var user, secret, code, token;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 3:
          user = _context5.sent;
          secret = process.env.SECRET;

          if (user) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(400).send("No user with this email"));

        case 7:
          code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000; // Generate token for user after user email exists and password matches

          token = jwt.sign({
            userId: user.id,
            isAdmin: user.isAdmin,
            code: code
          }, secret, {
            expiresIn: "1h"
          });
          user.resetToken = token; // Valid for 1 hr

          user.expireToken = Date.now() + 3600000;
          user.save().then(function (result) {
            var mailOptions = {
              from: process.env.EMAIL,
              to: user.email,
              subject: "Iconic Real Estate ✔",
              template: "index",
              context: {
                code: code
              }
            };
            transporter.sendMail(mailOptions, function (err, data) {
              if (err) {
                return res.status(401).send(err);
              }

              return res.status(200).send({
                code: code,
                token: token
              });
            }); // transporter.sendMail(
            //   {
            //     to: user.email,
            //     from: process.env.EMAIL,
            //     subject: "Iconic Real Estate ✔",
            //     html: `<h1>Your code is ${code}</h1><h5>Expires in 1 hr</h5>`,
            //   },
            //   (err, data) => {
            //     if (err) {
            //       return res.status(401).send(err);
            //     }
            //     return res.status(200).send({ code, token });
            //   }
            // );
          });
          _context5.next = 17;
          break;

        case 14:
          _context5.prev = 14;
          _context5.t0 = _context5["catch"](0);
          res.status(404).json({
            error: _context5.t0
          });

        case 17:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
/*----------------------------------------
        ENTER NEW PASSWORD
----------------------------------------- */

router.post("/enter-password", function (req, res) {
  try {
    var authHeader = req.headers["authorization"];
    var token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Missing token"
      });
    }

    var user = {};
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      if (err) {
        return res.status(401).json({
          error: err
        });
      }

      User.findOne({
        email: req.body.email,
        resetToken: token,
        expireToken: {
          $gt: Date.now()
        }
      }).then(function (user) {
        if (!user) {
          return res.status(401).send("Try again Session expired");
        } // has password and save it


        var hashedPassword = bcrypt.hashSync(req.body.password, 14);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then(function (savedUser) {
          res.status(200).send("User updated succcessfully");
        });
      });
    });
  } catch (e) {
    res.status(400).send("Something is wrong on our end");
  }
});
/*----------------------------------------
           CHECK USER CODE
----------------------------------------- */

router.post("/check-code", function _callee6(req, res) {
  var authHeader, token;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          authHeader = req.headers["authorization"];
          token = authHeader && authHeader.split(" ")[1];

          if (token) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", res.status(401).json({
            error: "Missing token"
          }));

        case 4:
          jwt.verify(token, process.env.SECRET, function (err, decoded) {
            if (err) {
              return res.status(401).json({
                error: err
              });
            }

            var code = decoded.code;
            console.log(code, req.body.code);

            if (Number(code) == Number(req.body.code)) {
              res.status(200).send(true);
            } else {
              return res.status(401).send(false);
            }
          });

        case 5:
        case "end":
          return _context6.stop();
      }
    }
  });
});
/*----------------------------------------
        SEARCH USER BY ID
----------------------------------------- */

router.get("/:id", function _callee7(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.params.id).select("-password"));

        case 3:
          user = _context7.sent;

          if (user) {
            _context7.next = 6;
            break;
          }

          return _context7.abrupt("return", res.status(500).json({
            message: "The user with the given ID was not found"
          }));

        case 6:
          res.status(200).send(true);
          _context7.next = 12;
          break;

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
/*----------------------------------------
        GET ALL USERS
----------------------------------------- */

router.get("/", function _callee8(req, res) {
  var userList;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(User.find().select("-password"));

        case 3:
          userList = _context8.sent;

          if (userList) {
            _context8.next = 6;
            break;
          }

          return _context8.abrupt("return", res.status(500).json({
            success: false
          }));

        case 6:
          res.send(userList);
          _context8.next = 12;
          break;

        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);

        case 12:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
module.exports = router;
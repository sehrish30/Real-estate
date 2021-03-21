"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("../models/agency"),
    Agency = _require.Agency;

var express = require("express");

var _require2 = require("../models/user"),
    User = _require2.User;

var router = express.Router();

var jwt = require("jsonwebtoken");

var bcrypt = require("bcryptjs");

var nodemailer = require("nodemailer");

var hbs = require("nodemailer-express-handlebars");

var mongoose = require("mongoose");

var cloudinary = require("cloudinary");

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
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET
});
/*----------------------------------------
            ALL AGENCIES
---------------------------------------- */

router.get("/", function _callee(req, res) {
  var locationFilter, nameFilter, mainFilter, agencyName, skip, count, agencyList;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          locationFilter = {};
          nameFilter = {};
          mainFilter = {}; // user can query by name and location

          if (req.query.location) {
            locationFilter = {
              location: {
                $in: req.query.location.split(",")
              }
            };
            mainFilter = _objectSpread({}, locationFilter);
          }

          if (req.query.name) {
            agencyName = new RegExp("^" + req.query.name);
            nameFilter = {
              name: agencyName
            };
            mainFilter = _objectSpread({}, mainFilter, {}, nameFilter);
          } // pagination agents


          skip = 0;
          count = null;

          if (req.query.count) {
            count = 10;
            skip = count - 10;
          }

          _context.next = 11;
          return regeneratorRuntime.awrap(Agency.find(mainFilter).select("-attachments -password").skip(skip).limit(count));

        case 11:
          agencyList = _context.sent;

          if (agencyList) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", res.status(204).send("No Results found"));

        case 14:
          res.send(agencyList);
          _context.next = 20;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: _context.t0
          });

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 17]]);
});
/*----------------------------------------
      Get all pending agencies
---------------------------------------- */

router.get("/pending-agencies", function _callee2(req, res) {
  var query, agencyList;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          query = {
            isApproved: false
          };
          _context2.next = 4;
          return regeneratorRuntime.awrap(Agency.find(query));

        case 4:
          agencyList = _context2.sent;

          if (agencyList) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(204).send("No results found"));

        case 7:
          res.status(200).send(agencyList);
          _context2.next = 13;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(400).json({
            error: e
          }));

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
/*----------------------------------------
            Agency DETAILS
---------------------------------------- */

router.get("/:id", function _callee3(req, res) {
  var agency;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Agency.findById(req.params.id).select("-attachments -password"));

        case 2:
          agency = _context3.sent;

          if (agency) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "The user with the given ID was not found"
          }));

        case 5:
          res.status(200).send(agency);

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
});
/*----------------------------------------
            REGISTER AGENCY
---------------------------------------- */

router.post("/register", function _callee4(req, res) {
  var _req$body, name, phoneNumber, email, logo, location, attachments, _agency;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body = req.body, name = _req$body.name, phoneNumber = _req$body.phoneNumber, email = _req$body.email, logo = _req$body.logo, location = _req$body.location, attachments = _req$body.attachments;
          _agency = new Agency({
            name: name,
            phoneNumber: phoneNumber,
            email: email,
            logo: logo,
            location: location,
            attachments: attachments
          });
          _context4.next = 5;
          return regeneratorRuntime.awrap(_agency.save());

        case 5:
          _agency = _context4.sent;

          if (_agency) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(400).send("We will contact you shortly"));

        case 8:
          return _context4.abrupt("return", res.send(_agency));

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            error: _context4.t0
          });

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
/*----------------------------------------
            Total Agencies
---------------------------------------- */

router.get("/get/count", function _callee5(req, res) {
  var agenciesCount;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Agency.countDocuments(function (count) {
            return count;
          }));

        case 2:
          agenciesCount = _context5.sent;

          if (agenciesCount) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", res.status(500).send("No agencies found"));

        case 5:
          res.send({
            agenciesCount: agenciesCount
          });

        case 6:
        case "end":
          return _context5.stop();
      }
    }
  });
});
/*----------------------------------------
            Agency REJECTED
---------------------------------------- */

router["delete"]("/rejected/:id", function _callee7(req, res) {
  var authHeader, token;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          authHeader = req.headers["authorization"];

          if (mongoose.isValidObjectId(req.params.id)) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", res.status(400).res("Invalid agency"));

        case 4:
          // because first element is Bearer then token so we need token
          // split will convert this to array
          token = authHeader && authHeader.split(" ")[1];

          if (token) {
            _context7.next = 7;
            break;
          }

          return _context7.abrupt("return", res.status(401).json({
            error: "Missing token"
          }));

        case 7:
          // appkey is the secret key used to sign jwt
          // user is encoded inside auth token which was sent as payload to jwt
          jwt.verify(token, process.env.SECRET, function (err, decoded) {
            if (err) {
              return res.status(401).json({
                error: err
              });
            } // access this user in our controller


            var isAdmin = decoded.isAdmin;

            if (isAdmin) {
              Agency.findByIdAndDelete(req.params.id).then(function (user) {
                if (user) {
                  user.attachments.map(function (attachment) {
                    cloudinary.uploader.destroy(attachment.file.public_id, function _callee6(result) {
                      return regeneratorRuntime.async(function _callee6$(_context6) {
                        while (1) {
                          switch (_context6.prev = _context6.next) {
                            case 0:
                              if (result.result == "ok") {
                                console.log("DONE");
                              }

                            case 1:
                            case "end":
                              return _context6.stop();
                          }
                        }
                      });
                    });
                  });
                  return res.status(200).json({
                    success: true,
                    message: "The user is deleted"
                  });
                } else {
                  return res.status(404).json({
                    success: false,
                    message: "Agency couldnot be deleted Try Again!"
                  });
                }
              })["catch"](function (err) {
                return res.status(500).json({
                  success: false,
                  error: err
                });
              });
            }
          });
          _context7.next = 13;
          break;

        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          return _context7.abrupt("return", res.status(500).json({
            success: false,
            error: err
          }));

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
/*----------------------------------------
            Agency ACCEPTED
---------------------------------------- */

router.put("/approved", function _callee9(req, res) {
  var authHeader, token;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          authHeader = req.headers["authorization"]; // because first element is Bearer then token so we need token
          // split will convert this to array

          token = authHeader && authHeader.split(" ")[1];

          if (token) {
            _context9.next = 5;
            break;
          }

          return _context9.abrupt("return", res.status(401).json({
            error: "Missing token"
          }));

        case 5:
          // appkey is the secret key used to sign jwt
          // user is encoded inside auth token which was sent as payload to jwt
          jwt.verify(token, process.env.SECRET, function (err, decoded) {
            if (err) {
              return res.status(401).json({
                error: err
              });
            } // access this user in our controller


            var isAdmin = decoded.isAdmin;

            if (isAdmin) {
              var randomNumber = Math.floor(Math.random() * 1000 + 1); // hash password

              var email = req.body.email.split("@").shift();
              var password = "".concat(email).concat(randomNumber);
              var passwordHash = bcrypt.hashSync(password, 14);
              Agency.findOneAndUpdate({
                _id: req.body.id
              }, {
                $set: {
                  password: passwordHash,
                  isApproved: true,
                  attachments: []
                }
              } // { upsert: true }
              ).then(function (result, err) {
                var mailOptions = {
                  from: process.env.EMAIL,
                  to: req.body.email,
                  subject: "Iconic Real Estate ✔",
                  template: "agency",
                  context: {
                    password: password
                  }
                };
                transporter.sendMail(mailOptions, function (err, data) {
                  if (err) {
                    console.log(err);
                    return res.status(401).send(err);
                  }
                });
                result.attachments.map(function (attachment) {
                  cloudinary.uploader.destroy(attachment.file.public_id, function _callee8(result) {
                    return regeneratorRuntime.async(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            console.log("Cloudinary", result);

                            if (result.result == "ok") {
                              console.log("DONE");
                            }

                          case 2:
                          case "end":
                            return _context8.stop();
                        }
                      }
                    });
                  });
                });
                return res.status(200).send("You are a certified agency. Your password is ".concat(password).concat(email));
              })["catch"](function (e) {
                console.log(e);
              });
            }
          });
          _context9.next = 11;
          break;

        case 8:
          _context9.prev = 8;
          _context9.t0 = _context9["catch"](0);
          return _context9.abrupt("return", res.status(500).json({
            success: false,
            error: _context9.t0
          }));

        case 11:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
/*----------------------------------------
            Agency LOGIN
---------------------------------------- */

router.post("/login", function _callee10(req, res) {
  var _agency2, secret, token;

  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(Agency.findOne({
            email: req.body.email
          }).select(["-attachments", "-isApproved"]));

        case 3:
          _agency2 = _context10.sent;
          secret = process.env.SECRET;

          if (_agency2) {
            _context10.next = 7;
            break;
          }

          return _context10.abrupt("return", res.status(400).send("The agency email not found"));

        case 7:
          if (!(_agency2 && bcrypt.compareSync(req.body.password, _agency2.password))) {
            _context10.next = 13;
            break;
          }

          _agency2.password = undefined;
          token = jwt.sign({
            agencyId: _agency2.id,
            isApproved: _agency2.isApproved
          }, secret, {
            expiresIn: "5d"
          });
          return _context10.abrupt("return", res.status(200).json({
            agency: _agency2,
            token: token
          }));

        case 13:
          return _context10.abrupt("return", res.status(400).send("Password Incorrect"));

        case 14:
          _context10.next = 19;
          break;

        case 16:
          _context10.prev = 16;
          _context10.t0 = _context10["catch"](0);
          return _context10.abrupt("return", res.status(500).send(_context10.t0));

        case 19:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
/*----------------------------------------
            Agency UPDATE
---------------------------------------- */

router.put("/edit-agency", function _callee12(req, res) {
  var authHeader, token;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          authHeader = req.headers["authorization"];
          token = authHeader && authHeader.split(" ")[1];

          if (mongoose.isValidObjectId(req.body.id)) {
            _context12.next = 4;
            break;
          }

          return _context12.abrupt("return", res.status(400).res("Invalid agency"));

        case 4:
          try {
            jwt.verify(token, process.env.SECRET, function _callee11(err, decoded) {
              var agencyId;
              return regeneratorRuntime.async(function _callee11$(_context11) {
                while (1) {
                  switch (_context11.prev = _context11.next) {
                    case 0:
                      if (!err) {
                        _context11.next = 2;
                        break;
                      }

                      return _context11.abrupt("return", res.status(401).json({
                        error: err
                      }));

                    case 2:
                      agencyId = decoded.agencyId;

                      if (!(agencyId == req.body.id)) {
                        _context11.next = 7;
                        break;
                      }

                      agency = Agency.findByIdAndUpdate(req.body.id, {
                        bio: req.body.bio,
                        location: req.body.location
                      }, {
                        "new": true
                      }).exec(function (err, result) {
                        if (err) {
                          return res.status(422).send("Agency couldn't be updated");
                        } else {
                          return res.send(result);
                        }
                      });
                      _context11.next = 8;
                      break;

                    case 7:
                      return _context11.abrupt("return", res.status(422).send("Something is wrong"));

                    case 8:
                    case "end":
                      return _context11.stop();
                  }
                }
              });
            });
          } catch (err) {
            console.log(err);
          }

        case 5:
        case "end":
          return _context12.stop();
      }
    }
  });
});
/*----------------------------------------
            Agency UPDATE Logo
---------------------------------------- */

router["delete"]("/delete-image", function _callee14(req, res) {
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          // Update Profile dp
          console.log(req.body);
          cloudinary.uploader.destroy(req.body.imageId, function _callee13(result) {
            return regeneratorRuntime.async(function _callee13$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    console.log(result);

                    if (!(result.result == "ok")) {
                      _context13.next = 3;
                      break;
                    }

                    return _context13.abrupt("return", res.status(200).send("DONE"));

                  case 3:
                    return _context13.abrupt("return", res.status(200).send("Not found"));

                  case 4:
                  case "end":
                    return _context13.stop();
                }
              }
            });
          });

        case 2:
        case "end":
          return _context14.stop();
      }
    }
  });
});
router.put("/upload-logo", function _callee16(req, res) {
  var authHeader, token;
  return regeneratorRuntime.async(function _callee16$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          authHeader = req.headers["authorization"];
          token = authHeader && authHeader.split(" ")[1];
          console.log(req.body);
          jwt.verify(token, process.env.SECRET, function _callee15(err, decoded) {
            var agencyId;
            return regeneratorRuntime.async(function _callee15$(_context15) {
              while (1) {
                switch (_context15.prev = _context15.next) {
                  case 0:
                    if (!err) {
                      _context15.next = 2;
                      break;
                    }

                    return _context15.abrupt("return", res.status(401).json({
                      error: err
                    }));

                  case 2:
                    agencyId = decoded.agencyId;

                    if (!(agencyId == req.body.id)) {
                      _context15.next = 6;
                      break;
                    }

                    _context15.next = 6;
                    return regeneratorRuntime.awrap(Agency.findByIdAndUpdate(req.body.id, {
                      logo: {
                        public_id: req.body.public_id,
                        url: req.body.secure_url
                      }
                    }, {
                      "new": true
                    }).exec(function (err, result) {
                      if (err) {
                        return res.status(422).send(err);
                      } else {
                        result.password = undefined;
                        result.isApproved = undefined;
                        return res.send(result);
                      }
                    }));

                  case 6:
                  case "end":
                    return _context15.stop();
                }
              }
            });
          });

        case 4:
        case "end":
          return _context16.stop();
      }
    }
  });
});
/*----------------------------------------
            Agency UPDATE Password
---------------------------------------- */

router.put("/change-password", function _callee18(req, res) {
  var authHeader, token;
  return regeneratorRuntime.async(function _callee18$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          authHeader = req.headers["authorization"];
          token = authHeader && authHeader.split(" ")[1];

          if (mongoose.isValidObjectId(req.body.id)) {
            _context18.next = 4;
            break;
          }

          return _context18.abrupt("return", res.status(400).res("Invalid agency"));

        case 4:
          try {
            jwt.verify(token, process.env.SECRET, function _callee17(err, decoded) {
              var agencyId, passwordHash, _token, returnData;

              return regeneratorRuntime.async(function _callee17$(_context17) {
                while (1) {
                  switch (_context17.prev = _context17.next) {
                    case 0:
                      if (!err) {
                        _context17.next = 2;
                        break;
                      }

                      return _context17.abrupt("return", res.status(401).json({
                        error: err
                      }));

                    case 2:
                      agencyId = decoded.agencyId;

                      if (!(agencyId === req.body.id)) {
                        _context17.next = 19;
                        break;
                      }

                      _context17.next = 6;
                      return regeneratorRuntime.awrap(Agency.findById(req.body.id).select("password"));

                    case 6:
                      agency = _context17.sent;

                      if (!bcrypt.compareSync(req.body.password, agency.password)) {
                        _context17.next = 17;
                        break;
                      }

                      passwordHash = bcrypt.hashSync(req.body.newPassword, 14); // Update agency with hashed password

                      _context17.next = 11;
                      return regeneratorRuntime.awrap(Agency.findByIdAndUpdate(req.body.id, {
                        password: passwordHash
                      }));

                    case 11:
                      newAgency = _context17.sent;
                      // generate token to send to user
                      _token = jwt.sign({
                        agencyId: newAgency.id,
                        isAdmin: true
                      }, process.env.SECRET, {
                        expiresIn: "15d"
                      });
                      newAgency.password = undefined;
                      newAgency.isApproved = undefined;
                      returnData = {
                        newAgency: newAgency,
                        token: _token
                      };
                      return _context17.abrupt("return", res.status(200).send(returnData));

                    case 17:
                      _context17.next = 20;
                      break;

                    case 19:
                      return _context17.abrupt("return", res.status(401).send("User not authorized"));

                    case 20:
                    case "end":
                      return _context17.stop();
                  }
                }
              });
            });
          } catch (error) {
            res.status(400).send(error);
          }

        case 5:
        case "end":
          return _context18.stop();
      }
    }
  });
});
/*----------------------------------------
        Agency Forgot Password
---------------------------------------- */

module.exports = router;
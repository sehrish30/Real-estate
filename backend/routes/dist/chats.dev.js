"use strict";

var _require = require("../models/chat"),
    Chat = _require.Chat;

var _require2 = require("../models/chatMsg"),
    ChatMsg = _require2.ChatMsg;

var express = require("express");

var _require3 = require("../models/user"),
    User = _require3.User;

var router = express.Router();

var jwt = require("jsonwebtoken");

var bcrypt = require("bcryptjs");

var nodemailer = require("nodemailer");

var hbs = require("nodemailer-express-handlebars");

var mongoose = require("mongoose");

var cloudinary = require("cloudinary");
/*----------------------------------------
         CHECK CHAT EXISTS
---------------------------------------- */


router.get("/check-chat", function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            Chat.findOne({
              customer: req.body.customer,
              agency: req.body.agency
            }).exec(function (err, chat) {
              if (err) {
                return res.status(422).json({
                  error: err
                });
              }

              if (!chat) {
                return res.status(200).json({
                  status: false
                });
              }

              return res.status(200).json({
                status: true
              });
            });
          } catch (err) {
            console.error(err);
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});
/*----------------------------------------
         CREATE CHAT
---------------------------------------- */

router.post("/createchat", function _callee2(req, res) {
  var chatRoom;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          chatRoom = new Chat({
            customer: req.body.customer,
            agency: req.body.agency,
            chats: []
          });
          _context2.next = 4;
          return regeneratorRuntime.awrap(chatRoom.save());

        case 4:
          chatRoom = _context2.sent;

          if (chatRoom) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(400).send("Chat couldn't be created"));

        case 7:
          return _context2.abrupt("return", res.status(200).json({
            status: "Chat created"
          }));

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
/*----------------------------------------
         CHATS MSG SEND
---------------------------------------- */

router.post("/send", function _callee3(req, res) {
  var getmsgId, msgId;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          console.log(req.body); // Save message in ChatMsg table and get the object id back

          getmsgId = function getmsgId() {
            var _req$body, content, type, msg;

            return regeneratorRuntime.async(function getmsgId$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _req$body = req.body, content = _req$body.content, type = _req$body.type;
                    msg = new ChatMsg({
                      content: content,
                      type: type,
                      author: req.body.author // user: req.body.user,

                    });
                    _context3.next = 4;
                    return regeneratorRuntime.awrap(msg.save());

                  case 4:
                    msg = _context3.sent;
                    return _context3.abrupt("return", msg._id);

                  case 6:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          };

          _context4.next = 5;
          return regeneratorRuntime.awrap(getmsgId());

        case 5:
          msgId = _context4.sent;
          console.log(msgId); // Save all messages in chat with room details

          console.log("HERE", msgId);
          Chat.findOneAndUpdate({
            customer: req.body.customer,
            agency: req.body.agency
          }, {
            $push: {
              chats: msgId
            }
          }, {
            "new": true
          }).exec(function (err, chat) {
            if (err || !chat) {
              return res.status(422).json({
                error: "No chat found"
              });
            } else {
              res.json(chat);
            }
          });
          _context4.next = 14;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", res.status(500).json({
            error: e
          }));

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
module.exports = router;
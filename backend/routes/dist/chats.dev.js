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
          _context.prev = 0;
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
          _context.next = 7;
          break;

        case 4:
          _context.prev = 4;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).send(_context.t0));

        case 7:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 4]]);
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
          return _context2.abrupt("return", res.status(500).send(_context2.t0));

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
/*----------------------------------------
       GET ALL CHATS OF CHATROOM
---------------------------------------- */

router.get("/all-chats", function _callee4(req, res) {
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          Chat.findOne({
            customer: req.body.customer,
            agency: req.body.agency
          }).populate("chats").sort({
            createdAt: -1
          }).exec(function (err, chatReturn) {
            if (err) {
              return res.status(402).send(err);
            }

            return res.send(chatReturn);
          });

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
});
/*----------------------------------------
          DELETE CHAT
---------------------------------------- */

router["delete"]("/delete-chat/:chatMsgId/:chatId", function _callee5(req, res) {
  var chat;
  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          console.log(req.params);
          _context6.next = 4;
          return regeneratorRuntime.awrap(ChatMsg.findByIdAndRemove(req.params.chatMsgId));

        case 4:
          chat = _context6.sent;

          if (!chat) {
            _context6.next = 10;
            break;
          }

          _context6.next = 8;
          return regeneratorRuntime.awrap(Chat.findOneAndUpdate({
            _id: req.params.chatId
          }, {
            $pull: {
              chats: req.params.chatMsgId
            }
          }, {
            "new": true
          }).populate("chats").exec(function (err, newUpdatedChatRoom) {
            if (!newUpdatedChatRoom || err) {
              return res.status(422).send(err);
            }

            return res.status(200).send(newUpdatedChatRoom);
          }));

        case 8:
          _context6.next = 11;
          break;

        case 10:
          return _context6.abrupt("return", res.status(400).send("Chat doesn't exist"));

        case 11:
          _context6.next = 16;
          break;

        case 13:
          _context6.prev = 13;
          _context6.t0 = _context6["catch"](0);
          return _context6.abrupt("return", res.status(500).send(_context6.t0));

        case 16:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
/*----------------------------------------
          BLOCK CHAT ROOM
---------------------------------------- */

router["delete"]("/block-chatroom/:chatId", function _callee8(req, res) {
  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          // get all the chatMsgs from chatRoom
          Chat.findById(req.params.chatId).then(function (chatroom) {
            // loop through chat msgs ids and delete them in Chat Msg table
            var requests = chatroom.chats.map(function _callee6(chatmessage) {
              return regeneratorRuntime.async(function _callee6$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      _context7.next = 2;
                      return regeneratorRuntime.awrap(ChatMsg.findByIdAndDelete(chatmessage));

                    case 2:
                    case "end":
                      return _context7.stop();
                  }
                }
              });
            });
            Promise.all(requests).then(function _callee7() {
              var deletedChatMsgs;
              return regeneratorRuntime.async(function _callee7$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      _context8.next = 2;
                      return regeneratorRuntime.awrap(Chat.findByIdAndUpdate(req.params.chatId, {
                        isblocked: true,
                        chats: []
                      }, {
                        "new": true
                      }));

                    case 2:
                      deletedChatMsgs = _context8.sent;

                      if (!deletedChatMsgs) {
                        _context8.next = 5;
                        break;
                      }

                      return _context8.abrupt("return", res.status(200).send(deletedChatMsgs));

                    case 5:
                    case "end":
                      return _context8.stop();
                  }
                }
              });
            });
          })["catch"](function (err) {
            return res.status(422).send(err);
          });
          _context9.next = 7;
          break;

        case 4:
          _context9.prev = 4;
          _context9.t0 = _context9["catch"](0);
          return _context9.abrupt("return", res.status(500).send(_context9.t0));

        case 7:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 4]]);
});
/*----------------------------------------
              UNBLOCK Chat
---------------------------------------- */

router.post("/unblock-chat", function _callee9(req, res) {
  var unblockedChat;
  return regeneratorRuntime.async(function _callee9$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(Chat.findByIdAndUpdate(req.body.chatId, {
            isblocked: false
          }, {
            "new": true
          }));

        case 3:
          unblockedChat = _context10.sent;

          if (!unblockedChat) {
            res.status(422).send("Some error has occured");
          }

          res.send(unblockedChat);
          _context10.next = 11;
          break;

        case 8:
          _context10.prev = 8;
          _context10.t0 = _context10["catch"](0);
          return _context10.abrupt("return", res.status(500).send(_context10.t0));

        case 11:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
module.exports = router;
const { Chat } = require("../models/chat");
const { ChatMsg } = require("../models/chatMsg");
const express = require("express");
const { User } = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");

/*----------------------------------------
         CHECK CHAT EXISTS
---------------------------------------- */
router.get("/check-chat", async (req, res) => {
  try {
    Chat.findOne({
      customer: req.body.customer,
      agency: req.body.agency,
    }).exec((err, chat) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      if (!chat) {
        return res.status(200).json({ status: false });
      }

      return res.status(200).json({ status: true });
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
         CREATE CHAT
---------------------------------------- */
router.post("/createchat", async (req, res) => {
  try {
    let chatRoom = new Chat({
      customer: req.body.customer,
      agency: req.body.agency,
      chats: [],
    });
    chatRoom = await chatRoom.save();
    if (!chatRoom) return res.status(400).send("Chat couldn't be created");

    return res.status(200).json({ status: "Chat created" });
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
         CHATS MSG SEND
---------------------------------------- */
router.post("/send", async (req, res) => {
  try {
    console.log(req.body);

    // Save message in ChatMsg table and get the object id back
    const getmsgId = async () => {
      const { content, type } = req.body;
      let msg = new ChatMsg({
        content,
        type,
        author: req.body.author,
        // user: req.body.user,
      });
      msg = await msg.save();
      return msg._id;
    };
    const msgId = await getmsgId();
    console.log(msgId);

    // Save all messages in chat with room details
    console.log("HERE", msgId);

    Chat.findOneAndUpdate(
      {
        customer: req.body.customer,
        agency: req.body.agency,
      },
      {
        $push: { chats: msgId },
      },
      {
        new: true,
      }
    ).exec((err, chat) => {
      if (err || !chat) {
        return res.status(422).json({ error: "No chat found" });
      } else {
        res.json(chat);
      }
    });
  } catch (err) {
    return res.status(500).json({ error: e });
  }
});

/*----------------------------------------
       GET ALL CHATS OF CHATROOM
---------------------------------------- */

router.get(`/all-chats`, async (req, res) => {
  try {
    const chats = await Chat.findOne({
      customer: req.body.customer,
      agency: req.body.agency,
    })
      .populate("chats")
      .sort({ createdAt: -1 });

    if (!chats) {
      return res.status(422).send("No chats");
    }

    return res.send(chats);
  } catch (err) {
    console.error(err);
  }
});

/*----------------------------------------
          DELETE CHAT
---------------------------------------- */

router.delete(`/delete-chat/:chatMsgId/:chatId`, async (req, res) => {
  try {
    console.log(req.params);
    const chat = await ChatMsg.findByIdAndRemove(req.params.chatMsgId);
    if (chat) {
      await Chat.findOneAndUpdate(
        { _id: req.params.chatId },
        {
          $pull: { chats: req.params.chatMsgId },
        },
        {
          new: true,
        }
      )
        .populate("chats")
        .exec((err, newUpdatedChatRoom) => {
          if (!newUpdatedChatRoom || err) {
            return res.status(422).send(err);
          }
          return res.status(200).send(newUpdatedChatRoom);
        });
    } else {
      return res.status(400).send("Chat doesn't exist");
    }

    //   .sort({ createdAt: -1 });
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
        BLOCK CHAT ROOM
---------------------------------------- */

/*----------------------------------------
          CLEAR CHAT
---------------------------------------- */

module.exports = router;

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
    console.error(err);
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
    console.error(err);
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

module.exports = router;

const { Chat } = require("../models/chat");
const { ChatMsg } = require("../models/chatMsg");
const express = require("express");
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

/*----------------------------------------
         CHECK CHAT EXISTS
---------------------------------------- */
router.get("/check-chat", async (req, res) => {
  try {
    console.log(req.query);
    Chat.findOne({
      customer: req.query.customer,
      agency: req.query.agency,
    }).exec((err, chat) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      if (!chat) {
        return res.status(200).json({ status: false });
      }
      if (chat.isblocked) {
        return res.status(200).json({
          status: true,
          isblocked: true,
          personWhoBlocked: chat.personWhoBlocked,
        });
      }

      return res.status(200).json({ status: true, isblocked: false });
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
    const data = await chatRoom
      .populate("customer", "email dp")
      .populate({
        path: "agency",
        select: "name logo",
      })
      .execPopulate();
    if (!chatRoom) return res.status(400).send("Chat couldn't be created");

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
         CHATS MSG SEND
---------------------------------------- */
router.post("/send", async (req, res) => {
  try {
    // Save message in ChatMsg table and get the object id back
    const getmsgId = async () => {
      const { content, type } = req.body;
      if (req.body.contentImgPublicId) {
        let msg = new ChatMsg({
          content,
          type,
          author: req.body.author,
          timesent: req.body.timesent,
          contentImgPublicId: req.body.contentImgPublicId,
          // user: req.body.user,
        });
        msg = await msg.save();
        return msg._id;
      } else {
        let msg = new ChatMsg({
          content,
          type,
          author: req.body.author,
          timesent: req.body.timesent,
          location: req.body.location,
          // user: req.body.user,
        });
        msg = await msg.save();
        return msg._id;
      }
    };
    const msgId = await getmsgId();

    // Save all messages in chat with room details

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
        res.json(msgId);
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

/*----------------------------------------
       GET ALL CHATS OF CHATROOM
---------------------------------------- */

router.get(`/all-chats`, async (req, res) => {
  console.error(req.query);
  Chat.findOne({ customer: req.query.customer, agency: req.query.agency })
    .populate({
      path: "chats",
      options: {
        limit: 50,
        sort: { createdAt: -1 },
        skip: req.params.pageIndex * 2,
      },
    })
    .populate("agency", "name")
    .populate("customer", "email")
    .sort({ createdAt: -1 })
    .exec((err, chatReturn) => {
      if (err) {
        return res.status(402).send(err);
      }
      return res.send(chatReturn);
    });
});

/*----------------------------------------
      GET ALL CHATROOMS OF A PERSON 
---------------------------------------- */

router.get(`/all-chatrooms`, async (req, res) => {
  console.error(req.query);
  Chat.find({ customer: req.query.customer })
    .populate("agency")
    .populate("chats")
    .sort({ updatedAt: -1 })
    .exec((err, chatrooms) => {
      if (err) {
        return res.status(402).send(err);
      }
      console.log(chatrooms);
      return res.status(200).send(chatrooms);
    });
});

/*----------------------------------------
    GET ALL CHATROOMS OF AN AGENCY
---------------------------------------- */

router.get(`/all-agencychatrooms`, async (req, res) => {
  console.error(req.query);
  Chat.find({ agency: req.query.agency })
    .populate("customer")
    .populate("chats")
    .sort({ updatedAt: -1 })
    .exec((err, chatrooms) => {
      if (err) {
        return res.status(402).send(err);
      }
      return res.send(chatrooms);
    });
});

/*----------------------------------------
          DELETE CHAT
---------------------------------------- */

router.delete(`/delete-chat/:chatMsgId/:chatId`, async (req, res) => {
  try {
    console.log(req.params);
    const chat = await ChatMsg.findByIdAndRemove(req.params.chatMsgId);

    if (chat.contentImgPublicId) {
      cloudinary.uploader.destroy(chat.contentImgPublicId, async (result) => {
        if (result.result == "ok") {
          console.log("DONE");
        }
      });
    }
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
router.delete(`/block-chatroom/:chatId/:personId`, async (req, res) => {
  console.error(req.params);
  try {
    // get all the chatMsgs from chatRoom
    Chat.findById(req.params.chatId)
      .then(async (chatroom) => {
        // loop through chat msgs ids and delete them in Chat Msg table
        // const requests = await Promise.all(
        //   chatroom.chats.map(async (chatmessage) => {
        //     const delChat = await ChatMsg.findByIdAndDelete(chatmessage);

        //     if (delChat?.contentImgPublicId) {
        //       cloudinary.uploader.destroy(
        //         delChat.contentImgPublicId,
        //         async (result) => {
        //           if (result.result == "ok") {
        //             console.log("DONE");
        //           }
        //         }
        //       );
        //     }
        //     return chatmessage;
        //   })
        // );

        // if (requests) {
        // delete chatroom
        const deletedChatMsgs = await Chat.findByIdAndUpdate(
          req.params.chatId,
          {
            isblocked: true,
            personWhoBlocked: req.params.personId,
            // chats: [],
          },
          {
            new: true,
          }
        );

        if (deletedChatMsgs) {
          return res.status(200).send(deletedChatMsgs);
        }
        // }
      })
      .catch((err) => res.status(422).send(err));
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
              UNBLOCK Chat
---------------------------------------- */

router.post(`/unblock-chat`, async (req, res) => {
  try {
    console.error(req.body);
    const unblockedChat = await Chat.findByIdAndUpdate(
      req.body.chatId,
      {
        isblocked: false,
        personWhoBlocked: null,
      },
      {
        new: true,
      }
    );
    if (!unblockedChat) {
      res.status(422).send("Some error has occured");
    }
    res.send(unblockedChat);
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
    GET ALL AGENCY CHAT ROOMS
---------------------------------------- */
router.get(`/all-agencychatrooms`, async (req, res) => {
  console.error(req.query);
  Chat.find({ agency: req.query.agency })
    .populate("customer")
    .populate("chats")
    .sort({ createdAt: -1 })
    .exec((err, chatrooms) => {
      if (err) {
        return res.status(402).send(err);
      }
      return res.send(chatrooms);
    });
});

/*----------------------------------------
    Mark all chats seen
---------------------------------------- */

router.put(`/all-chatsSeen`, async (req, res) => {
  try {
    const data = await Chat.findById(req.body.chatId).populate(
      "chats",
      "seen id author"
    );
    console.log(req.body);
    for (chat of data.chats) {
      if (!chat.seen && chat.author != req.body.person) {
        await ChatMsg.findByIdAndUpdate(
          chat.id,
          {
            seen: true,
          },
          { new: true }
        );
      }
    }

    return res.status(200).send(true);
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
   CHECK IF ANY CHAT HAS UNSEEN MSGS FOR AGENCY
---------------------------------------- */
router.get("/unseenchats-agency", async (req, res) => {
  try {
    let count = 0;
    Chat.find({
      agency: req.query.agency,
    })
      .populate({
        path: "chats",
      })
      .exec((err, data) => {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].chats.length; j++) {
            console.log(
              data[i].customer,
              data[i].chats[j].seen,
              data[i].chats[j].author,
              data[i].chats[j].content
            );
            console.log(
              data[i].chats[j].author.toString() == data[i].customer.toString()
            );
            if (
              data[i].chats[j].seen == false &&
              data[i].chats[j].author.toString() === data[i].customer.toString()
            ) {
              count = count + 1;
              break;
            }
          }
        }
        if (err) {
          return res.status(402).send(err);
        }

        return res.status(200).json(count);
      });
  } catch (err) {
    return res.status(500).send(err);
  }
});

/*----------------------------------------
   CHECK IF ANY CHAT HAS UNSEEN MSGS FOR CUSTOMER
---------------------------------------- */
router.get("/unseenchats-customer", async (req, res) => {
  try {
    let count = 0;

    Chat.find({
      customer: req.query.customer,
    })
      .populate({
        path: "chats",
      })
      .exec((err, data) => {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].chats.length; j++) {
            console.log(
              data[i].agency,
              data[i].chats[j].seen,
              data[i].chats[j].author,
              data[i].chats[j].content
            );
            if (
              data[i].chats[j].seen == false &&
              data[i].chats[j].author.toString() == data[i].agency
            ) {
              count = count + 1;
              break;
            }
          }
        }
        if (err) {
          return res.status(402).send(err);
        }

        return res.status(200).json(count);
      });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;

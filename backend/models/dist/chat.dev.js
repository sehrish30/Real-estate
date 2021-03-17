"use strict";

var mongoose = require("mongoose");

var chatSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  agency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent"
  },
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatMsg"
  }]
});
chatSchema.set("toJSON", {
  virtuals: true
});
chatSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
exports.Chat = mongoose.model("Chat", chatSchema);
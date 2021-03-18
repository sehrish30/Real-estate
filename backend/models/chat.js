const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new mongoose.Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  agency: {
    type: Schema.Types.ObjectId,
    ref: "Agent",
  },
  chats: [
    {
      type: Schema.Types.ObjectId,
      ref: "ChatMsg",
    },
  ],
  isblocked: {
    type: Boolean,
    default: false,
  },
});

chatSchema.set("toJSON", {
  virtuals: true,
});

chatSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

exports.Chat = mongoose.model("Chat", chatSchema);

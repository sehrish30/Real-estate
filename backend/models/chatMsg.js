const mongoose = require("mongoose");

const chatMsgSchema = mongoose.Schema(
  {
    content: String,
    type: {
      type: String,
      default: "String",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    timesent: {
      type: String,
      default: new Date().toISOString(),
    },
    contentImgPublicId: String,
  },
  {
    timestamps: true,
  }
);

chatMsgSchema.set("toJSON", {
  virtuals: true,
});

chatMsgSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

exports.ChatMsg = mongoose.model("ChatMsg", chatMsgSchema);

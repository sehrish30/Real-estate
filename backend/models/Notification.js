const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new mongoose.Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    agency: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
    },
    timesent: {
      type: String,
      default: new Date().toISOString(),
    },
    consultationId: {
      type: Schema.Types.ObjectId,
      ref: "Consultation",
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.set("toJSON", {
  virtuals: true,
});

notificationSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

exports.Chat = mongoose.model("Notification", notificationSchema);

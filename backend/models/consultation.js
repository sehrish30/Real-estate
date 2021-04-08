const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const consultationSchema = mongoose.Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    agency: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
    },
    phoneNumber: String,
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    timesent: {
      type: String,
      default: new Date().toISOString(),
    },
    message: {
      type: String,
    },
    isVirtual: {
      type: Boolean,
      default: true,
    },
    date: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
    rescdheuleMessage: String,
  },
  {
    timestamps: true,
  }
);

consultationSchema.set("toJSON", {
  virtuals: true,
});

consultationSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

exports.Category = mongoose.model("Consultation", consultationSchema);

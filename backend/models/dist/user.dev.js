"use strict";

var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    "default": false
  },
  dp: {
    type: String,
    "default": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fZ_ebLrIR7-37WMGcyj_RO-0TTcZGtUKtg&usqp=CAU"
  },
  resetToken: String,
  expireToken: Date
});
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", {
  virtuals: true
});
exports.User = mongoose.model("User", userSchema);
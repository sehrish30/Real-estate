"use strict";

var mongoose = require("mongoose");

var agencySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    "default": ""
  },
  isApproved: {
    type: Boolean,
    "default": false
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  logo: {
    type: Object,
    "default": {
      public_id: Date.now,
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fZ_ebLrIR7-37WMGcyj_RO-0TTcZGtUKtg&usqp=CAU"
    }
  },
  location: [String],
  attachments: [{
    category: String,
    file: {
      url: String,
      public_id: String
    }
  }],
  bio: {
    type: String
  },
  rating: {
    type: Number,
    "default": 0
  },
  reviews: [{
    user: String,
    text: String,
    time: String
  }],
  commercial: [String],
  land: [mongoose.ObjectId],
  residential: [mongoose.ObjectId],
  industrial: [mongoose.ObjectId]
}, {
  timestamps: true
});
agencySchema.set("toJSON", {
  transform: function transform(doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
exports.Agency = mongoose.model("Agent", agencySchema);
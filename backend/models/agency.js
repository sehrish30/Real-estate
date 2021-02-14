const mongoose = require("mongoose");

const agencySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: "",
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  logo: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fZ_ebLrIR7-37WMGcyj_RO-0TTcZGtUKtg&usqp=CAU",
  },
  location: [String],
  attachments: [
    {
      category: String,
      file: String,
    },
  ],
});

agencySchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

exports.Agency = mongoose.model("Agent", agencySchema);

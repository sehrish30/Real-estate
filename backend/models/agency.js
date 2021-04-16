const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const agencySchema = mongoose.Schema(
  {
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
      type: Object,
      default: {
        public_id: Date.now,
        url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fZ_ebLrIR7-37WMGcyj_RO-0TTcZGtUKtg&usqp=CAU",
      },
    },
    location: [String],
    attachments: [
      {
        category: String,
        file: {
          url: String,
          public_id: String,
        },
      },
    ],
    bio: {
      type: String,
    },
    rating: [
      {
        rate: Number,
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        text: String,
        time: {
          type: String,
          default: new Date().toISOString(),
        },
        replies: {
          type: Object,
          text: String,
          time: {
            type: String,
            default: new Date().toISOString(),
          },
        },
      },
    ],
    totalRating: {
      type: Number,
      default: parseInt(0),
    },
    consultations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Consultation",
        required: false,
      },
    ],
    officeTimingStart: String,
    officeTimingEnd: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    commercial: [String],
    land: [mongoose.ObjectId],
    residential: [mongoose.ObjectId],
    industrial: [mongoose.ObjectId],
    resetToken: String,
    expireToken: Date,
  },

  {
    timestamps: true,
  }
);

// agencySchema.set("toJSON", {
//   transform: function (doc, ret, options) {
//     ret.id = ret._id;
//     delete ret._id;
//     delete ret.__v;
//   },
// });

agencySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

agencySchema.set("toJSON", {
  virtuals: true,
});

exports.Agency = mongoose.model("Agent", agencySchema);

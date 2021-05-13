const mongoose = require("mongoose");

const propertySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
    },
    location: {
      type: Object,
    },
    network: [Object],
    // images: [
    //   {
    //     type: Object,
    //     default: {
    //       public_id: Date.now,
    //       url:
    //         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fZ_ebLrIR7-37WMGcyj_RO-0TTcZGtUKtg&usqp=CAU",
    //     },
    //   },
    // ],
    images: {
      type: [String],
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fZ_ebLrIR7-37WMGcyj_RO-0TTcZGtUKtg&usqp=CAU",
    },
    bathrooms: {
      type: Number,
      default: 1,
    },
    category: {
      type: String,
      default: "rent",
    },
    iBanNumber: {
      type: String,
    },
    description: {
      type: String,
      default:
        "State few words about your property to let customers know about you!",
    },
    Amenities: [String],
    rooms: {
      type: Number,
      default: 1,
    },
    type: {
      type: String,
      default: "Residential",
    },
    area: {
      type: Number,
    },
    city: {
      type: String,
    },
    noOfReports: {
      type: Number,
      default: 0,
    },
    // agency: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Agency",
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

propertySchema.set("toJSON", {
  virtuals: true,
});

propertySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

exports.Property = mongoose.model("Property", propertySchema);

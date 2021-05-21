const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const affordibiltySchema = Schema(
  {
    first: {
      type: String,
    },
    second: {
      type: String,
    },
    third: {
      type: String,
    },
    four: {
      type: String,
    },
    five: {
      type: String,
    },
    six: {
      type: String,
    },
    seven: {
      type: String,
    },
    eight: {
      type: String,
    },
    nine: {
      type: String,
    },
    ten: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

affordibiltySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

affordibiltySchema.set("toJSON", {
  virtuals: true,
});

exports.Affordibility = mongoose.model("Affordibility", affordibiltySchema);

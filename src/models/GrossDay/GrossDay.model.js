const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GrossDayModel = new Schema(
  {
    day: {
      type: String,
      require: true,
    },
    month: {
      type: String,
      require: true,
    },
    year: {
      type: String,
      require: true,
    },
    date: {
      type: String,
      require: true,
      index: true,
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "order",
      },
    ],
    gross: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const GrossDay = mongoose.model("gross_day", GrossDayModel);

module.exports = GrossDay;

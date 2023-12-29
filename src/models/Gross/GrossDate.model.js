const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GrossDateModel = new Schema(
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
    delivered_orders: {
      type: Number,
      default: 0,
    },
    cancle_orders: {
      type: Number,
      default: 0,
    },
    sub_gross: {
      type: Number,
      default: 0,
    },
    gross: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const GrossDay = mongoose.model("gross_day", GrossDateModel);

module.exports = GrossDay;

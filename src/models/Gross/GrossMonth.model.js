const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GrossMonthModel = new Schema(
  {
    month: {
      type: String,
      require: true,
    },
    year: {
      type: String,
      require: true,
    },
    orders: {
      type: Number,
      default: 0,
    },
    orders_delivered: {
      type: Number,
      default: 0,
    },
    orders_cancle: {
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

const GrossMonth = mongoose.model("gross_month", GrossMonthModel);

module.exports = GrossMonth;

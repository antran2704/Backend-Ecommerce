const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GrossYearModel = new Schema(
  {
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

const GrossYear = mongoose.model("gross_year", GrossYearModel);

module.exports = GrossYear;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PriceModel = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      require: true,
      index: true,
    },
    price: {
      type: Number,
      require: true,
    },
    promotion_price: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Price = mongoose.model("price", PriceModel);

module.exports = Price;

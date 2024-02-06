const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartItemModel = new Schema(
  {
    cart_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cart",
      require: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      require: true,
    },
    variation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product_item",
      require: true,
    },
    options: { type: String, default: null },
    quantity: Number,
    price: Number,
  },
  { timestamps: true }
);

const CartItem = mongoose.model("cart_item", CartItemModel);

module.exports = CartItem;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartModel = new Schema(
  {
    cart_userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
      index: true
    },
    cart_status: {
      type: String,
      enum: ["active", "pending", "failed", "completed"],
      default: "active",
    },
    // cart_products: [
    //   {
    //     product: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "product",
    //       require: true,
    //     },
    //     variation: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "product_item",
    //       require: true,
    //     },
    //     options: { type: String, default: null },
    //     quantity: Number,
    //     price: Number,
    //   }
    // ],
    cart_count: {
      type: Number,
      default: 0,
    },
    cart_total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("cart", CartModel);

module.exports = Cart;

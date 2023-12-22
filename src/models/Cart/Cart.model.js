const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartModel = new Schema(
  {
    cart_userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    cart_status: {
      type: String,
      enum: ["active", "pending", "failed", "completed"],
      default: "active",
    },
    cart_products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          require: true,
        },
        variation_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product_item",
          require: true,
        },
        options: { type: String, default: null },
        quantity: Number,
        price: Number,
      }
    ],
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
// create user + create cart
const KeyToken = mongoose.model("cart", CartModel);

module.exports = KeyToken;

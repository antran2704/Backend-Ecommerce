const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderModel = new Schema(
  {
    name: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        price: {
          type: Number,
          default: 0,
        },
        quantity: {
          type: Number,
          default: 0,
        },
        link: {
          type: String,
          default: null,
        },
      },
    ],
    total: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", OrderModel);

module.exports = Order;

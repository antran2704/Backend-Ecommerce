const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderModel = new Schema(
  {
    nameCustomer: {
      type: String,
      default: "",
    },
    addressCustomer: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    idProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    price: {
      type: Number,
      default: 0,
    },
    promotionPrice: {
      type: Number,
      default: null,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("order", OrderModel);

module.exports = Order;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderModel = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => mongoose.Types.ObjectId(),
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
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
        product: {
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
      enum: ["pending", "cancle", "success", "deliveri"],
      default: "pending",
    },
    discount_codes: [
      {
        dicount_name: String,
        discount_code: String,
      },
    ],
    cancleContent: {
      type: String,
      default: null,
    },
    note: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", OrderModel);

module.exports = Order;

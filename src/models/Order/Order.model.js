const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderModel = new Schema(
  {
    order_id: {
      type: String,
      require: true,
      index: true,
      unique: true,
    },
    user_infor: {
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
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
      index: true,
    },
    items: [
      {
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
        // options: [{ type: String }],
        price: {
          type: Number,
          default: 0,
        },
        promotion_price: {
          type: Number,
          default: 0,
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
    shipping_cost: {
      type: Number,
      default: 0,
    },
    sub_total: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "cancle", "processing", "delivered"],
      default: "pending",
    },
    discount: {
      type: {
        _id: String,
        discount_type: String,
        discount_name: String,
        discount_code: String,
        discount_value: Number,
        discount_min_value: Number,
      },
      default: null,
    },
    payment_method: {
      type: String,
      require: true,
    },
    payment_status: {
      type: String,
      enum: ["pending", "cancle", "success"],
      default: "pending",
    },
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

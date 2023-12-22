const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderModel = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => mongoose.Types.ObjectId(),
    },
    order_id: {
      type: String,
      require: true,
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
    },
    items: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "product_item",
        },
        product_id: {
          type: Schema.Types.ObjectId,
          ref: "product",
        },
        name: String,
        options: [{ type: String }],
        price: {
          type: Number,
          default: 0,
        },
        thumbnail: {
          type: String,
          default: null,
        },
        promotion_price: {
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
    discount_codes: {
      dicount_name: String,
      discount_code: String,
      discount_value: Number,
      discount_min_value: Number,
    },
    payment_method: {
      type: String,
      require: true,
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

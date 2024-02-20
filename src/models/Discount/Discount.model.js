const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiscountModel = new Schema(
  {
    discount_name: {
      type: String,
      require: true,
      index: true,
    },
    discount_description: {
      type: String,
      require: true,
    },
    discount_code: {
      type: String,
      require: true,
      index: true,
    },
    discount_applies: {
      type: String,
      enum: ["all", "specific"],
      default: "all",
    },
    discount_product_ids: {
      type: Array,
      default: [],
    },
    discount_type: {
      type: String,
      enum: ["fixed_amount", "percentage"],
      default: "percentage",
    },
    discount_value: {
      type: Number,
      require: true,
      default: 0,
    },
    discount_start_date: {
      type: Date,
      require: true,
    },
    discount_end_date: {
      type: Date,
      require: true,
    },
    discount_max_uses: {
      type: Number,
      require: true,
    },
    discount_used_count: {
      type: Number,
      default: 0,
    },
    discount_user_used: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        count: Number,
      },
    ],
    discount_per_user: {
      type: Number,
      default: 0,
      require: true,
    },
    discount_min_value: {
      type: Number,
      default: 0,
    },
    discount_active: {
      type: Boolean,
      default: true,
    },
    discount_public: {
      type: Boolean,
      default: true,
    },
    discount_thumbnail: {
      type: String,
      default: null,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
// create user + create cart
const Discount = mongoose.model("discount", DiscountModel);

module.exports = Discount;

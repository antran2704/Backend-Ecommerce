const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

// add slug
mongoose.plugin(slug);

const ProductItemModel = new Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    title: {
      type: String,
      default: null,
    },
    barcode: {
      type: String,
      default: null,
    },
    available: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      default: 0,
      require: true,
    },
    promotion_price: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
      default: null,
    },
    option1: {
      type: String,
      default: null,
    },
    option2: {
      type: String,
      default: null,
    },
    option3: {
      type: String,
      default: null,
    },
    options: [{ type: String }],
    thumbnail_url: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
    inventory_quantity: {
      type: Number,
      default: 0,
      require: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    public: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product_item", ProductItemModel);

module.exports = Product;

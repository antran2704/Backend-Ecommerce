const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductModel = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: "",
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
    listImages: [{ type: String }],
    hotProduct: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Number,
      default: 0,
    },
    viewer: {
      type: Number,
      default: 0,
    },
    stars: {
      type: Number,
      default: 0,
    },
    sizes: {
      type: Boolean,
      default: false,
    },
    listSizes: [
      {
        value: {
          type: String,
          default: null,
        },
      },
    ],
    colors: {
      type: Boolean,
      default: false,
    },
    listColors: [
      {
        value: {
          type: String,
          default: null,
        },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("product", ProductModel);

module.exports = Product;

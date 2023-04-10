const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

// add slug
mongoose.plugin(slug);

const ProductModel = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    shortDescription: {
      type: String,
      default: "",
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
    listImages: [{ type: String, default: null }],
    hotProduct: {
      type: Boolean,
      default: false,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    outOfStock: {
      type: Boolean,
      default: false,
    },
    viewer: {
      type: Number,
      default: 0,
    },
    stars: {
      type: Number,
      default: 0,
    },
    brand: {
      type: String,
      default: null,
    },
    listSizes: [
      {
        value: {
          type: String,
          default: null,
        },
        outOfStock: {
          type: Boolean,
          default: false,
        },
      },
    ],
    listColors: [
      {
        value: {
          type: String,
          default: null,
        },
        outOfStock: {
          type: Boolean,
          default: false,
        },
      },
    ],
    slug: {
      type: String,
      slug: "name",
      unique: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", ProductModel);

module.exports = Product;

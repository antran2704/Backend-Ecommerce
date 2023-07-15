const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

// add slug
mongoose.plugin(slug);

const ProductModel = new Schema(
  {
    title: {
      type: String,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    type: [
      {
        title: String,
        _id: String
      }
    ],
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
    gallery: [{ type: String, default: null }],
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
    status: {
      type: Boolean,
      default: false,
    },
    viewer: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      default: 0,
    },
    brand: {
      type: String,
      default: null,
    },
    options: [
      {
        title: String,
        list: [
          {
            name: String,
            status: Boolean
          }
        ]
      }
    ],
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", ProductModel);

module.exports = Product;

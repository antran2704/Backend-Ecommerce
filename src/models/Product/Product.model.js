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
      index: "text",
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      require: true,
    },
    shortDescription: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    // price: {
    //   type: Number,
    //   default: 0,
    // },
    // promotion_price: {
    //   type: Number,
    //   default: 0,
    // },
    thumbnail: {
      type: String,
      default: null,
    },
    gallery: [{ type: String, default: null }],
    hotProduct: {
      type: Boolean,
      default: false,
    },
    // inventory: {
    //   type: Number,
    //   default: 0,
    // },
    sold: {
      type: Number,
      default: 0,
    },
    public: {
      type: Boolean,
      default: false,
    },
    barcode: {
      type: String,
      default: null,
    },
    sku: {
      type: String,
      default: null,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
      default: null,
    },
    breadcrumbs: [{ type: mongoose.Schema.Types.ObjectId, ref: "category" }],
    options: [
      {
        code: String,
        name: String,
        values: [
          {
            label: String,
          },
        ],
      },
    ],
    specifications: [
      {
        id: String,
        name: String,
        attributes: [
          {
            id: String,
            name: String,
            value: String,
          },
        ],
      },
    ],
    variations: [{ type: mongoose.Schema.Types.ObjectId, ref: "product_item" }],
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    isHot: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", ProductModel);

module.exports = Product;

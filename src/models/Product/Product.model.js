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
      require: true
    },
    type: [
      {
        title: String,
        _id: String,
      },
    ],
    shortDescription: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
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
    inventory: {
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
        name: String,
        attributes: [
          {
            name: String,
            value: String,
          },
        ],
      },
    ],
    variations: [
      {
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
        promotionPrice: {
          type: Number,
          default: null,
        },
        sku: {
          type: String,
          default: null,
          require: true,
        },
        option1: String,
        option2: String,
        option3: String,
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
      },
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

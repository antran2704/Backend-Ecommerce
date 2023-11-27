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
      default: 0,
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
    public: {
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
        thumbnail: {
          type: String,
          default: null,
        },
        url: {
          type: String,
          default: null,
        },
        inventory: {
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

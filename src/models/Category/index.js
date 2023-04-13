const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

// add slug
mongoose.plugin(slug);

const CategoryModel = new Schema(
  {
    title: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: null,
    },
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    subCategories: [
      {
        label: {
          type: String,
          default: null,
        },
        slug: {
          type: String,
          default: null,
        },
      },
    ],
    filters: [
      {
        title: {
          type: String,
          default: null,
        },
        listFilterItem: [
          {
            type: String,
            default: null,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Category = mongoose.model("category", CategoryModel);

module.exports = Category;

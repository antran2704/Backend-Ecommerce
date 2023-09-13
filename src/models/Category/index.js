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
    description: {
      type: String,
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
    options: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "option",
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("category", CategoryModel);

module.exports = Category;

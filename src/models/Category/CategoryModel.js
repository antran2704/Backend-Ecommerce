const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoryModel = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("category", CategoryModel);

module.exports = Category;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

// add slug
mongoose.plugin(slug);

const documentName = "category";

const CategoryModel = new Schema(
  {
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: documentName,
      default: null,
    },
    title: {
      type: String,
      require: true,
      default: null,
      index: true
    },
    description: {
      type: String,
      default: null,
    },
    meta_title: {
      type: String,
      default: null,
    },
    meta_description: {
      type: String,
      default: null,
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
    public: {
      type: Boolean,
      default: true,
    },
    breadcrumbs: [{ type: mongoose.Schema.Types.ObjectId, ref: documentName }],
    childrens: [{ type: mongoose.Schema.Types.ObjectId, ref: documentName }],
  },
  { timestamps: true }
);

const Category = mongoose.model(documentName, CategoryModel);

module.exports = Category;

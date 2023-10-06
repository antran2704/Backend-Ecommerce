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
    },
    title: {
      type: String,
      require: true,
      default: null,
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
    status: {
      type: Boolean,
      default: true,
    },
    breadcrumbs: [
      {
        label: String,
        url_path: String,
      },
    ],
    // options: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "option",
    // },
    childrens: [{ type: mongoose.Schema.Types.ObjectId, ref: documentName }],
  },
  { timestamps: true }
);

const Category = mongoose.model(documentName, CategoryModel);

module.exports = Category;

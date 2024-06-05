const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

// add slug
mongoose.plugin(slug);

const documentName = "blog";

const BlogModel = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      require: true,
    },
    title: {
      type: String,
      require: true,
      index: true,
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
    content: {
      type: String,
      require: true,
    },
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    breadcrumbs: [{ type: mongoose.Schema.Types.ObjectId, ref: "tag_blog" }],
    tags: [
      {
        tag: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "tag_blog",
        },
        slug: String,
      },
    ],
    public: {
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

const Blog = mongoose.model(documentName, BlogModel);

module.exports = Blog;

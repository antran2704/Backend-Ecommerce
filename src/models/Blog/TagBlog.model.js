const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

// add slug
mongoose.plugin(slug);

const documentName = "tag_blog";

const TagBlogModel = new Schema(
  {
    title: {
      type: String,
      require: true,
      index: "text",
      index: true,
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const TagBlog = mongoose.model(documentName, TagBlogModel);

module.exports = TagBlog;

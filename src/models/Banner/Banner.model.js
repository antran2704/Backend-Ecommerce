const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BannerModel = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    meta_title: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    path: {
      type: String,
      default: null,
    },
    isPublic: {
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

const Banner = mongoose.model("banner", BannerModel);

module.exports = Banner;

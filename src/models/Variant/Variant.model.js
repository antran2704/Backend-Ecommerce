const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

// add slug
mongoose.plugin(slug);

const VariantModel = new Schema(
  {
    code: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    variants: [
      {
        name: String,
        status: {
          type: Boolean,
          default: true,
        },
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
// create user + create cart
const Variant = mongoose.model("variant", VariantModel);

module.exports = Variant;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

// add slug
mongoose.plugin(slug);

const VariantModel = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    code: {
      type: String,
      require: true,
      // slug: "name",
      // unique: true,
    },
    variants: [
      {
        name: String,
        public: {
          type: Boolean,
          default: true,
        },
      },
    ],
    public: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
// create user + create cart
const Variant = mongoose.model("variant", VariantModel);

module.exports = Variant;

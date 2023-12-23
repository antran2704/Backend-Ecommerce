const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

// add slug
mongoose.plugin(slug);

const AttributeModel = new Schema(
  {
    name: {
      type: String,
      require: true,
      index: true
    },
    code: {
      type: String,
      require: true,
      index: true
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
const Attribute = mongoose.model("variant", AttributeModel);

module.exports = Attribute;

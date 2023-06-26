const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

// add slug
mongoose.plugin(slug);
/* add product -> show category 
[
  "Mobile" -> get id category,
  "tablet"
] 
->
[
  "ốp lưng" -> get id option,
  "dây sạc"
]
*/
const CategoryModel = new Schema(
  {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String
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
    options: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "option",
      }, 
    ],
  },
  { timestamps: true }
);

const Category = mongoose.model("category", CategoryModel);

module.exports = Category;

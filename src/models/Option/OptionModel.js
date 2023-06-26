const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OptionModel = new Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    title: String
  },
  { timestamps: true }
);

const Option = mongoose.model("option", OptionModel);

module.exports = Option;

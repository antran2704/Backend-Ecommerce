const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OptionModel = new Schema(
  {
    list: [
      {
        title: String,
      },
    ],
  },
  { timestamps: true }
);

const Option = mongoose.model("option", OptionModel);

module.exports = Option;

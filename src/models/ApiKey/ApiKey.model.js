const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApiKeyModel = new Schema(
  {
    key: {
      type: String,
      require: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
      index: true,
    },
    permission: {
      type: String,
      require: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ApiKey = mongoose.model("api_key", ApiKeyModel);

module.exports = ApiKey;

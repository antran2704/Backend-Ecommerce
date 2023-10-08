const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const KeyTokenModel = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    privateKey: {
      type: String,
      require: true,
    },
    publicKey: {
      type: String,
      require: true,
    },
    refreshToken: {
      type: String,
      require: true,
    },
    refreshTokenUseds: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const KeyToken = mongoose.model("key", KeyTokenModel);

module.exports = KeyToken;
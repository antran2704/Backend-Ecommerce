const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const KeyTokenModel = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
      index: true
    },
    privateKey: {
      type: String,
      require: true,
    },
    publicKey: {
      type: String,
      require: true,
    },
    changePasswordKey: {
      type: String,
      default: null
    },
    forgetPasswordKey: {
      type: String,
      default: null
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

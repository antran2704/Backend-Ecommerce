const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = new Schema(
  {
    name: {
      type: String,
      default: null,
      index: true
    },
    email: {
      type: String,
      default: null,
      index: true
    },
    password: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    avartar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: "USER"
    },
    banned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserModel);

module.exports = User;

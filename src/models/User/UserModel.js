const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserModel);

module.exports = User;

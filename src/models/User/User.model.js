const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = new Schema(
  {
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    // role: {
    //   type: String,
    //   enum: ["admin", "user"],
    //   default: "user",
    // },
    banned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserModel);

module.exports = User;

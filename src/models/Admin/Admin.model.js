const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminModel = new Schema(
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
    avartar: {
      type: String,
      default: null,
    },
    banned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("admin", AdminModel);

module.exports = User;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationModel = new Schema(
  {
    content: {
      type: String,
      require: true,
    },
    isReaded: {
      type: Boolean,
      default: false,
    },
    path: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      enum: ["product", "order", "discount", "system"],
      default: "system",
    },
  },
  { timestamps: true }
);

const NotificationItemAdmin = mongoose.model(
  "notification_item_admin",
  NotificationModel
);

module.exports = NotificationItemAdmin;

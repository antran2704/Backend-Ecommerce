const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InventoryModel = new Schema(
  {
    inventory_product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      require: true,
      index: true
    },
    inventory_stock: {
      type: Number,
      require: true,
    },
    inventory_location: {
      type: String,
      default: "Unknow",
    },
  },
  { timestamps: true }
);
// create user + create cart
const Inventory = mongoose.model("inventory", InventoryModel);

module.exports = Inventory;

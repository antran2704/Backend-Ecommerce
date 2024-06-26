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
  },
  { timestamps: true }
);

const Inventory = mongoose.model("inventory", InventoryModel);

module.exports = Inventory;

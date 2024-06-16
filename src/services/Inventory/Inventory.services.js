const { getDateTime } = require("../../helpers/getDateTime");
const { Inventory } = require("../../models");

class InventoryServices {
  async createInventory(product_id, inventory_stock) {
    if (!product_id) return null;

    const inventory = await Inventory.create({
      inventory_product: product_id,
      inventory_stock,
    });

    return inventory;
  }

  async getInventory(product_id) {
    if (!product_id) return null;

    const inventory = await Inventory.findOne({
      inventory_product: product_id,
    }).lean();
    return inventory;
  }

  async updateInventory(product_id, payload) {
    if (!product_id) return null;

    const date = getDateTime();
    const updated = await Inventory.findOneAndUpdate(
      { inventory_product: product_id },
      { $set: { ...payload, updatedAt: date } }
    );

    return updated;
  }
}

module.exports = new InventoryServices();

const { getDateTime } = require("../../helpers/getDateTime");
const { Inventory } = require("../../models");

class InventoryServices {
  // thanh toan moi tru hang ton kho
  async createInventory(
    product_id,
    inventory_stock,
    inventory_location = "Unknow"
  ) {
    if (!product_id) return null;

    const inventory = await Inventory.create({
      inventory_product: product_id,
      inventory_stock,
      inventory_location,
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

  async deleteInventory(product_id) {
    if (!product_id) return null;

    const deleted = await Inventory.findOneAndRemove({
      inventory_product: product_id,
    });
    return deleted;
  }
}

module.exports = new InventoryServices();

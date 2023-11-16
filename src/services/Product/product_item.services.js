const { isValidObjectId } = require("mongoose");
const { ProductItem } = require("../../models");
const { getDateTime } = require("../../helpers/getDateTime");

class ProductItemServices {
  async getProductItems(id) {
    if (!id || !isValidObjectId(id)) return null;

    const variations = ProductItem.find({ product_id: id }).lean();
    return variations;
  }

  async getProductItemsWithPage(id, pageSize, currentPage) {
    if (!id || !isValidObjectId(id)) return null;

    const variations = ProductItem.find({ product_id: id })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return variations;
  }

  async getProductItemById(id) {
    if (
      !id ||
      !isValidObjectId(id)
    )
      return null;

    const variation = ProductItem.findOne({ _id: id }).lean();
    return variation;
  }

  async createProductItem(payload) {
    if (!payload) return null;

    const variation = ProductItem.create({ ...payload });

    return variation;
  }

  async updateProductItem(id, payload) {
    if (!id || !payload || !isValidObjectId(id)) return null;

    const date = getDateTime();
    const variation = ProductItem.findByIdAndUpdate(
      { _id: id },
      { $set: { ...payload, updatedAt: date } },
      { upsert: true, new: true }
    );

    return variation;
  }

  async deleteProductItem(id) {
    if (!id || !isValidObjectId(id)) return null;

    const variation = ProductItem.findByIdAndRemove({ _id: id });
    return variation;
  }
}

module.exports = new ProductItemServices();
const { isValidObjectId } = require("mongoose");
const { ProductItem } = require("../../models");
const { getDateTime } = require("../../helpers/getDateTime");

class ProductItemServices {
  async getProductItems(id) {
    if (!id || !isValidObjectId(id)) return null;

    const variations = ProductItem.find({ product_id: id }).lean();
    return variations;
  }

  async getProductItemsWithPage(id, pageSize, currentPage, select = {}) {
    if (!id || !isValidObjectId(id)) return null;

    const variations = ProductItem.find({ product_id: id })
      .select({ ...select })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return variations;
  }

  async getProductItemById(id, select = {}) {
    if (!id || !isValidObjectId(id)) return null;

    const variation = ProductItem.findOne({ _id: id })
      .select({ ...select })
      .lean();
    return variation;
  }

  async createProductItem(payload) {
    if (!payload) return null;

    const variation = ProductItem.create({ ...payload });

    return variation;
  }

  async updateProductItem(id, payload, query = {}) {
    // if (!id || !payload || !isValidObjectId(id)) return null;
    if (!id || !isValidObjectId(id)) return null;

    const date = getDateTime();
    const variation = ProductItem.findByIdAndUpdate(
      { _id: id },
      { $set: { ...payload, updatedAt: date }, ...query  },
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

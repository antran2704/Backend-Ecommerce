const { getDateTime } = require("../../helpers/getDateTime");
const { Price } = require("../../models");

class PriceServices {
  async createPrice(product_id, payload) {
    if (!product_id) return null;

    const price = await Price.create({
      product: product_id,
      ...payload,
    });

    return price;
  }

  async getPrice(product_id) {
    if (!product_id) return null;

    const price = await Price.findOne({
      product: product_id,
    }).lean();
    return price;
  }

  async updatePrice(product_id, payload) {
    if (!product_id) return null;

    const date = getDateTime();
    const updated = await Price.findOneAndUpdate(
      { product: product_id },
      { $set: { ...payload, updatedAt: date } }
    );

    return updated;
  }
}

module.exports = new PriceServices();

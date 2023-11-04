const { Variant } = require("../../models");
const { getDateTime } = require("../../helpers/getDateTime");

class VariantServices {
  async createVariant(payload) {
    const variant = await Variant.create(payload);
    return variant;
  }

  async updateVariant(id, payload) {
    if (!id || !payload) return null;

    const date = getDateTime();
    const variant = await Variant.findByIdAndUpdate(
      { _id: id },
      { $set: { ...payload, updatedAt: date }, upsert: true, new: true }
    );

    return variant;
  }

  async deleteVariant(id) {
    const variant = await Variant.findByIdAndRemove({ _id: id });
    return variant;
  }
}

module.exports = new VariantServices();

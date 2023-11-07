const { Variant } = require("../../models");
const { getDateTime } = require("../../helpers/getDateTime");
const { isValidObjectId } = require("mongoose");

class VariantServices {
  async getVariants() {
    const variants = await Variant.find({}).lean();
    return variants;
  }

  async getVariantsWithPage(pageSize, currentPage) {
    const variants = await Variant.find({})
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return variants;
  }

  async getVariantByCode(code) {
    if (!code) return null;

    const variant = await Variant.findOne({ code }).lean();
    return variant;
  }

  async getVariantById(id) {
    if (!id || !isValidObjectId(id)) return null;

    const variant = await Variant.findById({ _id: id }).lean();
    return variant;
  }

  async createVariant(payload) {
    const variant = await Variant.create(payload);
    return variant;
  }

  async updateVariant(id, payload) {
    if (!id || !isValidObjectId(id) || !payload) return null;

    const date = getDateTime();
    const variant = await Variant.findByIdAndUpdate(
      { _id: id },
      { $set: { ...payload, updatedAt: date }, upsert: true, new: true }
    );

    return variant;
  }

  async updateChildInVariant(parent_id, children_id, payload) {
    if (
      !parent_id ||
      !children_id ||
      !isValidObjectId(parent_id) ||
      !isValidObjectId(children_id)
    )
      return null;

    const date = getDateTime();
    const variant = await Variant.findOneAndUpdate(
      { _id: parent_id },
      {
        $set: { "variants.$[i]": payload, updatedAt: date },
        upsert: true,
        new: true,
      },
      {
        arrayFilters: [
          {
            "i._id": children_id,
          },
        ],
      }
    );

    return variant;
  }

  async addChildInVariant(id, payload) {
    if (!id || !isValidObjectId(id)) return null;

    const variant = await Variant.findByIdAndUpdate(
      { _id: id },
      {
        $push: { variants: payload },
        $set: { updatedAt: date },
        upsert: true,
        new: true,
      }
    );

    return variant;
  }

  async deleteChildInVariant(parent_id, children_id) {
    if (
      !parent_id ||
      !children_id ||
      !isValidObjectId(parent_id) ||
      !isValidObjectId(children_id)
    )
      return null;

    const variant = await Variant.findByIdAndUpdate(
      { _id: parent_id },
      {
        $pull: { variants: { _id: children_id } },
        $set: { updatedAt: date },
        upsert: true,
        new: true,
      }
    );

    return variant;
  }

  async deleteVariant(id) {
    if (!id || !isValidObjectId(id)) return null;

    const variant = await Variant.findByIdAndRemove({ _id: id });
    return variant;
  }
}

module.exports = new VariantServices();

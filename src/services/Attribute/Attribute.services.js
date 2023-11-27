const { Attribute } = require("../../models");
const { getDateTime } = require("../../helpers/getDateTime");
const { isValidObjectId } = require("mongoose");

class AttributeServices {
  async getAttributes(query = {}) {
    const attributes = await Attribute.find({...query}).lean();
    return attributes;
  }

  async getAttributesWithPage(pageSize, currentPage, query = {}) {
    const attributes = await Attribute.find({...query})
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return attributes;
  }

  async getAttributeByCode(code) {
    if (!code) return null;

    const attribute = await Attribute.findOne({ code }).lean();
    return attribute;
  }

  async getAttributeById(id) {
    if (!id || !isValidObjectId(id)) return null;

    const attribute = await Attribute.findById({ _id: id }).lean();

    return attribute;
  }

  async searchTextItems(text) {
    const totalItems = await Attribute.find({
      name: { $regex: text, $options: "i" },
    });
    return totalItems;
  }

  async searchTextWithPage(text, pageSize, currentPage) {
    const items = await Attribute.find({
      name: { $regex: text, $options: "i" },
    })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    return items;
  }

  async createAttribute(payload) {
    const attribute = await Attribute.create(payload);
    return attribute;
  }

  async updateAttribute(id, payload) {
    if (!id || !isValidObjectId(id) || !payload) return null;

    const date = getDateTime();
    const attribute = await Attribute.findByIdAndUpdate(
      { _id: id },
      { $set: { ...payload, updatedAt: date } },
      {
        new: true,
        upsert: true,
      }
    );

    return attribute;
  }

  async updateChildInAttribute(parent_id, children_id, payload) {
    if (
      !parent_id ||
      !children_id ||
      !isValidObjectId(parent_id) ||
      !isValidObjectId(children_id)
    )
      return null;

    const date = getDateTime();
    const attribute = await Attribute.findOneAndUpdate(
      { _id: parent_id },
      {
        $set: { "variants.$[i]": {...payload}, updatedAt: date },
      },
      {
        arrayFilters: [
          {
            "i._id": children_id,
          },
        ],
        new: true,
        upsert: true,
      }
    );

    return attribute;
  }

  async addChildInAttribute(id, payload) {
    if (!id || !isValidObjectId(id)) return null;

    const date = getDateTime();
    const attribute = await Attribute.findByIdAndUpdate(
      { _id: id },
      {
        $push: { variants: payload },
        $set: { updatedAt: date },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return attribute;
  }

  async deleteChildInAttribute(parent_id, children_id) {
    if (
      !parent_id ||
      !children_id ||
      !isValidObjectId(parent_id) ||
      !isValidObjectId(children_id)
    )
      return null;

    const date = getDateTime();
    const attribute = await Attribute.findOneAndUpdate(
      { _id: parent_id, variants: { $elemMatch: { _id: children_id } } },
      {
        $pull: { variants: { _id: children_id } },
        $set: { updatedAt: date },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return attribute;
  }

  async deleteAttribute(id) {
    if (!id || !isValidObjectId(id)) return null;

    const attribute = await Attribute.findByIdAndRemove({ _id: id });
    return attribute;
  }
}

module.exports = new AttributeServices();

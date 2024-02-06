const { isValidObjectId } = require("mongoose");
const convertObjectToString = require("../../helpers/convertObjectString");
const { getDateTime } = require("../../helpers/getDateTime");
const { Category } = require("../../models/index");

class CategoriesServices {
  async getCategories(select = null, query = {}) {
    const categories = await Category.find({
      ...query,
      isDeleted: false,
    })
      .lean()
      .select({ ...select });
    return categories;
  }

  async getCategoriesWithPage(
    pageSize,
    currentPage,
    select = null,
    query = {}
  ) {
    const categories = await Category.find({ ...query, isDeleted: false })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .select({ ...select })
      .lean();

    return categories;
  }

  async getParentCategory(select) {
    const categories = await Category.find({
      parent_id: null,
      isDeleted: false,
    })
      .select({
        // _id: 1,
        // parent_id: 1,
        // title: 1,
        // childrens: 1,
        ...select,
      })
      .lean();
    return categories;
  }

  async findCategory(slug, query = {}) {
    const category = await Category.findOne({
      slug,
      isDeleted: false,
      ...query,
    }).lean();

    return category;
  }

  async findCategoryById(id, query = {}) {
    const category = await Category.findById({
      _id: id,
      isDeleted: false,
      ...query,
    })
      .populate("parent_id", { _id: 1, title: 1 })
      .populate("childrens", { _id: 1, title: 1, slug: 1 })
      .populate("breadcrumbs", { _id: 1, title: 1, slug: 1 })
      .lean();
    return category;
  }

  async createCategory(payload) {
    const newCategory = await Category.create({ ...payload });
    return newCategory;
  }

  async insertChildrendCategory(parent_id, id) {
    if (!parent_id || !id) return null;
    const category = await Category.findOneAndUpdate(
      { _id: parent_id },
      { $push: { childrens: id } }
    );

    return category;
  }

  async searchTextItems(text, query = {}) {
    const totalItems = await Category.countDocuments({
      title: { $regex: text, $options: "i" },
      isDeleted: false,
      ...query,
    }).lean();
    return totalItems;
  }

  async searchTextWithPage(
    text,
    pageSize,
    currentPage,
    limit = null,
    query = {}
  ) {
    const items = await Category.find({
      title: { $regex: text, $options: "i" },
      isDeleted: false,
      ...query,
    })
      .skip((currentPage - 1) * pageSize)
      .limit(limit)
      .lean();

    return items;
  }

  async updateCategory(id, payload) {
    if (!id) {
      return null;
    }

    if (id === payload.parent_id) {
      return null;
    }

    if (!isValidObjectId(id)) {
      return null;
    }

    const date = getDateTime();

    const category = await Category.findById({ _id: id });

    const parent_id = isValidObjectId(category.parent_id)
      ? convertObjectToString(category.parent_id)
      : null;

    if (parent_id !== payload.parent_id) {
      this.deleteChildrendCategory(category.parent_id, id);
      this.insertChildrendCategory(payload.parent_id, id);
    }

    await category.updateOne({
      $set: { ...payload, updatedAt: date },
      upsert: true,
      new: true,
    });

    return category;
  }

  async updateParentInChildren(parent_id, new_parent_id) {
    const date = getDateTime();
    const categories = await Category.updateMany(
      { parent_id },
      {
        $set: { parent_id: new_parent_id, updatedAt: date },
        upsert: true,
        new: true,
      }
    );

    return categories;
  }

  async updateChildrenInParent(id, childrens) {
    if (!id) return null;
    const date = getDateTime();
    const category = await Category.findById({ _id: id });

    await category.updateOne({
      $push: { childrens: { $each: childrens } },
      $set: { updatedAt: date },
      upsert: true,
      new: true,
    });

    return category;
  }

  async deleteCategory(id) {
    if (!id) return null;

    const date = getDateTime();
    const category = await Category.findByIdAndRemove({ _id: id });

    return category;
  }

  async deleteChildrendCategory(parent_id, id) {
    if (!id || !parent_id) return null;
    const category = await Category.findByIdAndUpdate(
      { _id: parent_id },
      { $pull: { childrens: id } }
    );

    return category;
  }
}

module.exports = new CategoriesServices();

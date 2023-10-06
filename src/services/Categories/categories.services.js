const { getDateTime } = require("../../helpers/getDateTime");
const { Category } = require("../../models/index");

class CategoriesServices {
  async getAllCategories() {
    const categories = await Category.find({}).lean();
    return categories;
  }

  async getCategoriesWithPage(pageSize, currentPage) {
    const categories = await Category.find({})
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return categories;
  }

  async findCategory(slug) {
    const category = await Category.findOne({ slug }).lean();

    return category;
  }

  async findCategoryById(id) {
    const category = await Category.findById({ _id: id }).lean();
    return category;
  }

  async addCategory(payload) {
    const newCategory = await Category.create({ ...payload });
    return newCategory;
  }

  async searchTextItems(text) {
    const totalItems = await Category.find({
      title: { $regex: text, $options: "i" },
    });
    return totalItems;
  }

  async searchTextWithPage(text, pageSize, currentPage) {
    const items = await Category.find({
      title: { $regex: text, $options: "i" },
    })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    return items;
  }

  async updateCategory(id, payload) {
    const date = getDateTime();
    const category = await Category.findByIdAndUpdate(
      { _id: id },
      { $set: { ...payload, updatedAt: date } }
    );

    return category;
  }
}

module.exports = new CategoriesServices();

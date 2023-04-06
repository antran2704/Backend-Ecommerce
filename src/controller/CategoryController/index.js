const { Category } = require("../../models/index");

const CategoryController = {
  // [GET] ALL CATEGORY
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find({});
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [GET] A CATEGORY
  getACategory: async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findById({_id: id});
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [POST] A CATEGORY
  addCategory: async (req, res) => {
    try {
      const data = req.body;
      const newCategory = await new Category(data);
      newCategory.save();
      res.status(200).json("Add new category succesfully");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [PATCH] A CATEGORY
  changeCategory: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
      const category = await Category.findById({ _id: id });
      if (!category) {
        res.status(404).json("Category not exit");
        return;
      }
      await category.update(data);
      res.status(200).json("Updated category succesfully");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [DELETE] A CATEGORY
  deleteCategory: async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findById({ _id: id });
      if (!category) {
        res.status(404).json("Category not exit");
        return;
      }
      await category.remove();
      res.status(200).json("Deleted category succesfully");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = CategoryController;

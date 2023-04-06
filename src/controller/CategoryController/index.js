const { Category } = require("../../models/index");

const CategoryController = {
  // [GET] ALL CATEGORY
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find({});
      res.status(200).json({
        status: 200,
        payload: categories
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [GET] A CATEGORY
  getACategory: async (req, res) => {
    const { slug } = req.params;
    try {
      const category = await Category.findOne({ slug });
      if (!category) {
        res.status(404).json({
          status: 404,
          message: "Category not exit",
        });
        return;
      }
      res.status(200).json({
        status: 200,
        payload: category
      });
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
      res.status(200).json({
        status: 200,
        message: "Add new category succesfully"
      });
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
        res.status(404).json({
          status: 404,
          message: "Category not exit",
        });
        return;
      }
      await category.update(data);
      res.status(200).json({
        status: 200,
        message: "Updated category succesfully"
      });
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
        res.status(404).json({
          status: 404,
          message: "Category not exit"
        });
        return;
      }
      await category.remove();
      res.status(200).json({
        status: 200,
        message: "Deleted category succesfully"
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = CategoryController;

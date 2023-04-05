const { Category } = require("../../models/index");

const CategoryController = {
  // [GET] ALL CATEGORY
  getAllCategory: async (req, res) => {
    try {
      const categories = await Category.find({});
      res.status(200).json(categories);
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
};

module.exports = CategoryController;

const { Category, Option } = require("../../models/index");

const PAGE_SIZE = 16;

const CategoryController = {
  // [GET] ALL CATEGORY
  getAllCategories: async (req, res) => {
    const currentPage = req.query.page ? req.query.page : 1;
    try {
      const totalItems = await Category.find({});

      const categories = await Category.find({})
        .skip((currentPage - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);

      return res.status(200).json({
        status: 200,
        payload: categories,
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // [GET] A CATEGORY
  getACategory: async (req, res) => {
    const { slug } = req.params;
    try {
      const category = await Category.findOne({ slug });
      if (!category) {
        return res.status(404).json({
          status: 404,
          message: "Category not exit",
        });
      }

      return res.status(200).json({
        status: 200,
        payload: category,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // [POST] A CATEGORY
  addCategory: async (req, res) => {
    try {
      const { title, description, thumbnail, options } = req.body;

      const newOption = await new Option({
        list: options,
      });

      const newCategory = await new Category({
        title,
        description,
        thumbnail,
        options: newOption._id,
      });

      newOption.save();
      newCategory.save();

      return res.status(200).json({
        status: 200,
        message: "Add new category succesfully",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  uploadThumbnail: async (req, res) => {
    const thumbnail = `${process.env.API_ENDPOINT}/${req.file.path}`;

    return res.status(200).json({
      status: 200,
      payload: {
        thumbnail,
      },
    });
  },
  // [PATCH] A CATEGORY
  changeCategory: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
      const category = await Category.findById({ _id: id });

      if (!category) {
        return res.status(404).json({
          status: 404,
          message: "Category not exit",
        });
      }

      await category.updateOne(data);

      return res.status(200).json({
        status: 200,
        message: "Updated category succesfully",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // [DELETE] A CATEGORY
  deleteCategory: async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findById({ _id: id });
      if (!category) {
        return res.status(404).json({
          status: 404,
          message: "Category not exit",
        });
      }

      await category.remove();

      return res.status(200).json({
        status: 200,
        message: "Deleted category succesfully",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  test: async (req, res) => {
    const { name } = req.body;

    try {
      const category = await Category.findOne({
        filters: { $elemMatch: { title: name } },
      });

      if (!category) {
        res.status(404).json("Category not exit");
        return;
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = CategoryController;

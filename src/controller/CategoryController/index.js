const {
  InternalServerError,
  NotFoundError,
} = require("../../helpers/errorResponse");
const {
  GetResponse,
  CreatedResponse,
} = require("../../helpers/successResponse");
const { getDateTime } = require("../../helpers/getDateTime");
const { Category, Option } = require("../../models/index");
const { CategoriesServices } = require("../../services/index");
const categoriesServices = require("../../services/Categories/categories.services");

const CategoryController = {
  // [GET] ALL CATEGORY
  getAllCategories: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;

    try {
      const totalItems = await CategoriesServices.getAllCategories();

      if (!totalItems) {
        return new NotFoundError(404, "No category found!").send(res);
      }

      const categories = await CategoriesServices.getCategoriesWithPage(
        PAGE_SIZE,
        currentPage
      );

      if (!categories) {
        return new NotFoundError(404, "No category found!").send(res);
      }

      return new GetResponse(200, categories).send(res, {
        optionName: "pagination",
        data: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  // [GET] A CATEGORY
  getCategory: async (req, res) => {
    const { slug } = req.params;
    try {
      const category = await CategoriesServices.findCategory(slug);

      if (!category) {
        return new NotFoundError(404, "No category found!").send(res);
      }

      return new GetResponse(200, category).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  // [GET] A CATEGORY BY ID
  getCategoryById: async (req, res) => {
    const { id } = req.params;
    try {
      const category = await CategoriesServices.findCategoryById(id);

      if (!category) {
        return new NotFoundError(404, "No category found!").send(res);
      }

      return new GetResponse(200, category).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  // [POST] A CATEGORY
  addCategory: async (req, res) => {
    try {
      const newCategory = await categoriesServices.addCategory(req.body);

      if (!newCategory) {
        return new NotFoundError(404, "Add category failed").send(res);
      }

      return new CreatedResponse(201, newCategory).send(res, {
        message: "Create category success!",
      });
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  searchCategories: async (req, res) => {
    const { search, page } = req.query;
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = page ? Number(page) : 1;

    try {
      const totalItems = await categoriesServices.searchTextItems(search);

      if (!totalItems) {
        return new NotFoundError(
          404,
          `No categoryies with title ${search}`
        ).send(res);
      }

      const items = await categoriesServices.searchTextWithPage(
        search,
        PAGE_SIZE,
        currentPage
      );

      if (!items) {
        return new NotFoundError(
          404,
          `No categories with title ${search}`
        ).send(res);
      }

      return new GetResponse(200, items).send(res, {
        optionName: "pagination",
        data: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  uploadThumbnail: async (req, res) => {
    const thumbnail = `${process.env.API_ENDPOINT}/${req.file.path}`;
    return new CreatedResponse(201, thumbnail).send(res);
  },
  // [PATCH] A CATEGORY
  updateCategory: async (req, res) => {
    const { id } = req.params;
    const { title, description, thumbnail, options, optionId } = req.body;
    const date = getDateTime();

    // update: post contains [optionId] -> find option and change
    try {
      const category = await categoriesServices.updateCategory(id, req.body);

      if (!category) {
        return new NotFoundError(404, "Update category failed").send(res);
      }

      return new CreatedResponse(201, "Updated category success!").send(res);

    } catch (error) {
      return new InternalServerError(500, error.stack).send(res);
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

const {
  InternalServerError,
  NotFoundError,
  BadResquestError,
} = require("../../helpers/errorResponse");
const getSelect = require("../../helpers/getSelect");
const {
  GetResponse,
  CreatedResponse,
} = require("../../helpers/successResponse");
const { CategoriesServices } = require("../../services/index");

const CategoryController = {
  // [GET] ALL CATEGORY WITH PAGE
  getCategories: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;

    try {
      const totalItems = await CategoriesServices.getCategories();

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
  // [GET] ALL CATEGORY
  getCategoriesAll: async (req, res) => {
    const select = getSelect(req.query);
    try {
      const categories = await CategoriesServices.getCategories(select);

      if (!categories) {
        return new NotFoundError(404, "No category found!").send(res);
      }

      return new GetResponse(200, categories).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getParentCategories: async (req, res) => {
    try {
      const categories = await CategoriesServices.getParentCategory({
        _id: 1,
        parent_id: 1,
        title: 1,
        childrens: 1,
      });

      if (!categories) {
        return new NotFoundError(404, "No category found!").send(res);
      }

      return new GetResponse(200, categories).send(res);
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
  createCategory: async (req, res) => {
    try {
      const data = req.body;

      if (!data) {
        return new BadResquestError().send(res);
      }

      const { parent_id } = data;
      const newCategory = await CategoriesServices.createCategory(req.body);

      if (!newCategory) {
        return new NotFoundError(404, "Add category failed").send(res);
      }

      if (parent_id) {
        const parentCategory = await CategoriesServices.findCategoryById(
          parent_id
        );

        if (!parentCategory) {
          return new NotFoundError(404, "Parent category not found").send(res);
        }

        await CategoriesServices.insertChildrendCategory(
          parent_id,
          newCategory._id
        );
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
      const totalItems = await CategoriesServices.searchTextItems(search);

      if (!totalItems) {
        return new NotFoundError(
          404,
          `No categoryies with title ${search}`
        ).send(res);
      }

      const items = await CategoriesServices.searchTextWithPage(
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

    try {
      const category = await CategoriesServices.updateCategory(id, req.body);

      if (!category) {
        return new BadResquestError(404, "Update category failed").send(res);
      }

      return new CreatedResponse(201, "Updated category success!").send(res);
    } catch (error) {
      return new InternalServerError(500, error.stack).send(res);
    }
  },
  // [DELETE] A CATEGORY
  deleteCategory: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return new BadResquestError().send(res);
    }

    try {
      const category = await CategoriesServices.deleteCategory(id);

      if (!category) {
        return new NotFoundError(404, "Delete category failed").send(res);
      }

      CategoriesServices.updateParentInChildren(
        category._id,
        category.parent_id
      );

      if (category.parent_id) {
        CategoriesServices.updateChildrenInParent(
          category.parent_id,
          category.childrens
        );

        CategoriesServices.deleteChildrendCategory(category.parent_id, id);
      }

      return new CreatedResponse(201, "Delete category success!").send(res);
    } catch (error) {
      return new InternalServerError(500, error.stack).send(res);
    }
  },
};

module.exports = CategoryController;

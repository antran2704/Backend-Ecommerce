const {
  InternalServerError,
  NotFoundError,
} = require("../../helpers/errorResponse");
const getSelect = require("../../helpers/getSelect");
const { GetResponse } = require("../../helpers/successResponse");
const { CategoriesServices } = require("../../services/index");

const UserCategoryController = {
  // [GET] ALL CATEGORY WITH PAGE
  getCategories: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;

    const select = getSelect(req.query);

    const query = {
      public: true,
    };

    try {
      const totalItems = await CategoriesServices.getCategories(select, query);

      if (!totalItems) {
        return new NotFoundError(404, "No category found!").send(res);
      }

      const categories = await CategoriesServices.getCategoriesWithPage(
        PAGE_SIZE,
        currentPage,
        select,
        query
      );

      if (!categories) {
        return new NotFoundError(404, "No category found!").send(res);
      }

      return new GetResponse(200, categories).send(res, {
        pagination: {
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
    const query = {
      public: true,
    };
    try {
      const categories = await CategoriesServices.getCategories(select, query);

      if (!categories) {
        return new NotFoundError(404, "No category found!").send(res);
      }

      return new GetResponse(200, categories).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getParentCategories: async (req, res) => {
    const select = getSelect(req.query);

    try {
      const categories = await CategoriesServices.getParentCategory(select);

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
    const query = {
      public: true,
    };

    try {
      const category = await CategoriesServices.findCategory(slug, query);

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
    const query = {
      public: true,
    };

    try {
      const category = await CategoriesServices.findCategoryById(id, query);

      if (!category) {
        return new NotFoundError(404, "No category found!").send(res);
      }

      return new GetResponse(200, category).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  searchCategories: async (req, res) => {
    const { search, page, limit } = req.query;
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = page ? Number(page) : 1;
    const limitQuery = limit ? limit : PAGE_SIZE;
    const query = {
      public: true,
    };

    try {
      const totalItems = await CategoriesServices.searchTextItems(
        search,
        query
      );

      if (!totalItems) {
        return new NotFoundError(
          404,
          `No categoryies with title ${search}`
        ).send(res);
      }

      const items = await CategoriesServices.searchTextWithPage(
        search,
        PAGE_SIZE,
        currentPage,
        limitQuery,
        query
      );

      if (!items) {
        return new NotFoundError(
          404,
          `No categories with title ${search}`
        ).send(res);
      }

      return new GetResponse(200, items).send(res, {
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
};

module.exports = UserCategoryController;

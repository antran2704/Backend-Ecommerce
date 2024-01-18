const { ProductServices, InventoryServices } = require("../../services");

const {
  InternalServerError,
  NotFoundError,
  BadResquestError,
} = require("../../helpers/errorResponse");
const {
  GetResponse,
  CreatedResponse,
} = require("../../helpers/successResponse");
const getSelect = require("../../helpers/getSelect");

const UserProductController = {
  // [GET] ALL PRODUCT
  getProducts: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;
    const select = getSelect(req.query);
    const query = {
      public: true,
    };

    try {
      const totalItems = await ProductServices.getProducts(query);
      if (!totalItems) {
        return new NotFoundError(404, "No product found!").send(res);
      }

      const products = await ProductServices.getProductsWithPage(
        PAGE_SIZE,
        currentPage,
        select,
        query
      );

      if (!products) {
        return new NotFoundError(404, "No product found!").send(res);
      }

      return new GetResponse(200, products).send(res, {
        optionName: "pagination",
        data: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  // [GET] ALL PRODUCT FOLLOW CATEGORY
  getProductsInCategory: async (req, res) => {
    const { id } = req.params;
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;
    const lte = req.query.lte ? Number(req.query.lte) : null;
    const gte = req.query.gte ? Number(req.query.gte) : null;
    const { search } = req.query;

    const keys = Object.keys(req.query).filter(
      (query) => query !== "page" && query !== "lte" && query !== "gte"
    );

    const query = {
      public: true,
    };

    try {
      if (keys.length > 0 || lte || gte) {
        const values = Object.values(req.query).flat();

        const totalItems = await ProductServices.getProductsFilter(
          id,
          search,
          keys,
          values,
          lte,
          gte,
          query
        );

        if (!totalItems) {
          return new NotFoundError(404, "Not found product!").send(res);
        }

        const products = await ProductServices.getProductsFilterWithPage(
          id,
          search,
          keys,
          values,
          PAGE_SIZE,
          currentPage,
          lte,
          gte,
          query
        );

        if (!products) {
          return new NotFoundError(404, "Not found product!").send(res);
        }

        return new GetResponse(200, products).send(res, {
          optionName: "pagination",
          data: {
            totalItems: totalItems.length,
            currentPage,
            pageSize: PAGE_SIZE,
          },
        });
      }

      const totalItems = await ProductServices.getProductsInCategory(id);

      if (!totalItems) {
        return new NotFoundError(404, "Not found product!").send(res);
      }

      const products = await ProductServices.getProductsInCategoryWithPage(
        id,
        PAGE_SIZE,
        currentPage
      );

      if (!products) {
        return new NotFoundError(404, "Not found product!").send(res);
      }

      return new GetResponse(200, products).send(res, {
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
  // [GET] A PRODUCT
  getProduct: async (req, res) => {
    const { slug } = req.params;
    const query = {
      public: true,
    };

    try {
      const product = await ProductServices.getProduct(slug, query);

      if (!product) {
        return new NotFoundError(404, "Not found product!").send(res);
      }

      return new GetResponse(200, product).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getProductById: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return new BadResquestError().send(res);
    }

    const select = getSelect(req.query);
    const query = {
      public: true,
    };

    try {
      const product = await ProductServices.getProductById(id, select, query);

      if (!product) {
        return new NotFoundError(404, "Not found product!").send(res);
      }

      return new GetResponse(200, product).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  // [SEARCH PRODUCT]
  searchProduct: async (req, res) => {
    const { search, category, page, limit } = req.query;
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = page ? Number(page) : 1;
    const limitQuery = limit ? limit : PAGE_SIZE;
    const query = {
      public: true,
    };

    try {
      const totalItems = await ProductServices.searchTextItems(
        search,
        category,
        query
      );

      if (!totalItems) {
        return new NotFoundError(404, `No product with title ${search}`).send(
          res
        );
      }

      const products = await ProductServices.searchTextWithPage(
        search,
        category,
        PAGE_SIZE,
        currentPage,
        limitQuery,
        query
      );

      if (!products) {
        return new NotFoundError(404, `No product with title ${search}`).send(
          res
        );
      }

      return new GetResponse(200, products).send(res, {
        optionName: "pagination",
        data: {
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

module.exports = UserProductController;

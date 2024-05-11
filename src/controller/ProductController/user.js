const {
  ProductServices,
  InventoryServices,
  CacheProductServices,
} = require("../../services");

const {
  InternalServerError,
  NotFoundError,
  BadResquestError,
} = require("../../helpers/errorResponse");
const { GetResponse } = require("../../helpers/successResponse");
const getSelect = require("../../helpers/getSelect");
const { checkValidNumber } = require("../../helpers/number");
const { isValidObjectId } = require("mongoose");

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

      const products = await ProductServices.getProductsWithPage(
        PAGE_SIZE,
        currentPage,
        select,
        query
      );

      return new GetResponse(200, products).send(res, {
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
  // [GET] ALL PRODUCT
  getOtherProducts: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;
    const { product_id, category_id } = req.query;
    const select = getSelect(req.query, ["product_id", "category_id"]);

    let query = {};

    if (category_id) {
      query = {
        category: category_id,
        _id: { $ne: product_id },
        public: true,
      };
    } else {
      query = {
        _id: { $ne: product_id },
        public: true,
      };
    }

    try {
      const totalItems = await ProductServices.getProducts(query);
      const products = await ProductServices.getProductsWithPage(
        PAGE_SIZE,
        currentPage,
        select,
        query
      );

      return new GetResponse(200, products).send(res, {
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
  // [GET] ALL PRODUCT
  getHotProducts: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;
    const select = getSelect(req.query, ["product_id", "category_id"]);

    let query = { public: true, isHot: true };

    try {
      const totalItems = await ProductServices.getProducts(query);
      const products = await ProductServices.getProductsWithPage(
        PAGE_SIZE,
        currentPage,
        select,
        query
      );

      return new GetResponse(200, products).send(res, {
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
  // [GET] ALL PRODUCT FOLLOW CATEGORY
  getProductsInCategory: async (req, res) => {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      return new BadResquestError().send(res);
    }

    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;
    const gte =
      req.query.filterPrice && checkValidNumber(req.query.filterPrice)
        ? Number(req.query.filterPrice.split(".")[0])
        : null;

    const lte =
      req.query.filterPrice && checkValidNumber(req.query.filterPrice)
        ? Number(req.query.filterPrice.split(".")[1])
        : null;
    const { search } = req.query;
    const parseQuery = {};

    const keys = Object.keys(req.query).filter(
      (key) => key !== "page" && key !== "search" && key !== "filterPrice"
    );

    for (const key of keys) {
      parseQuery[key] = [req.query[key]].flat();
    }

    const values = keys.map((key) => req.query[key]).flat();

    const query = {
      public: true,
    };

    const select = {
      title: 1,
      slug: 1,
      thumbnail: 1,
      price: 1,
      promotion_price: 1,
      inventory: 1,
    };

    try {
      const totalItems = await ProductServices.getProductsFilter(
        id,
        search,
        keys,
        values,
        lte,
        gte,
        query
      );

      const products = await ProductServices.getProductsFilterWithPage(
        id,
        search,
        keys,
        values,
        PAGE_SIZE,
        currentPage,
        lte,
        gte,
        query,
        select
      );

      return new GetResponse(200, products).send(res, {
        pagination: {
          totalItems: totalItems,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  // [GET] A PRODUCT
  getProduct: async (req, res) => {
    const { slug, id } = req.params;

    const query = {
      public: true,
    };

    const cacheProduct = await CacheProductServices.getProduct(
      CacheProductServices.KEY_PRODUCT + id
    );

    if (cacheProduct && cacheProduct._id && cacheProduct.public) {
      console.log("cache product");

      return new GetResponse(200, cacheProduct).send(res);
    }

    try {
      const product = await ProductServices.getProduct(slug, query);

      if (!product) {
        return new NotFoundError(404, "Not found product!").send(res);
      }

      // set cache product
      await CacheProductServices.setCacheProduct(
        CacheProductServices.KEY_PRODUCT + product._id,
        product
      );

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
    const limitQuery = limit ? Number(limit) : PAGE_SIZE;

    const select = getSelect(req.query);
    const query = {
      public: true,
    };

    try {
      const totalItems = await ProductServices.searchTextItems(
        search,
        category,
        query
      );

      const products = await ProductServices.searchTextWithPage(
        search,
        category,
        limitQuery,
        currentPage,
        query,
        select
      );

      return new GetResponse(200, products).send(res, {
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: limitQuery,
        },
      });
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
};

module.exports = UserProductController;

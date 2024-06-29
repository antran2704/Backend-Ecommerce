const {
  ProductServices,
  CacheProductServices,
  PriceServices,
  InventoryServices,
  CachePriceServices,
  CacheInventoryServices,
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

      const items = await ProductServices.getProductsWithPage(
        PAGE_SIZE,
        currentPage,
        select,
        query
      );

      const products = [];

      for (let i = 0; i < items.length; i++) {
        const product = items[i];
        const priceProduct = await PriceServices.getPrice(product._id);
        const inventoryProduct = await InventoryServices.getInventory(
          product._id
        );

        if (!priceProduct || !inventoryProduct) {
          products.push(product);
        } else {
          products.push({
            ...product,
            price: priceProduct.price,
            promotion_price: priceProduct.promotion_price,
            inventory: inventoryProduct.inventory_stock,
          });
        }
      }

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
      const items = await ProductServices.getProductsWithPage(
        PAGE_SIZE,
        currentPage,
        select,
        query
      );

      const products = [];

      for (let i = 0; i < items.length; i++) {
        const product = items[i];
        const priceProduct = await PriceServices.getPrice(product._id);
        const inventoryProduct = await InventoryServices.getInventory(
          product._id
        );

        if (!priceProduct || !inventoryProduct) {
          products.push(product);
        } else {
          products.push({
            ...product,
            price: priceProduct.price,
            promotion_price: priceProduct.promotion_price,
            inventory: inventoryProduct.inventory_stock,
          });
        }
      }

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
      const items = await ProductServices.getProductsWithPage(
        PAGE_SIZE,
        currentPage,
        select,
        query
      );

      const products = [];

      for (let i = 0; i < items.length; i++) {
        const product = items[i];
        const priceProduct = await PriceServices.getPrice(product._id);
        const inventoryProduct = await InventoryServices.getInventory(
          product._id
        );

        if (!priceProduct || !inventoryProduct) {
          products.push(product);
        } else {
          products.push({
            ...product,
            price: priceProduct.price,
            promotion_price: priceProduct.promotion_price,
            inventory: inventoryProduct.inventory_stock,
          });
        }
      }

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

      const items = await ProductServices.getProductsFilterWithPage(
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

      const products = [];

      for (let i = 0; i < items.length; i++) {
        const product = items[i];
        const priceProduct = await PriceServices.getPrice(product._id);
        const inventoryProduct = await InventoryServices.getInventory(
          product._id
        );

        if (!priceProduct || !inventoryProduct) {
          products.push(product);
        } else {
          products.push({
            ...product,
            price: priceProduct.price,
            promotion_price: priceProduct.promotion_price,
            inventory: inventoryProduct.inventory_stock,
          });
        }
      }

      return new GetResponse(200, products).send(res, {
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
  // [GET] A PRODUCT
  getProduct: async (req, res) => {
    const { slug, product_id } = req.params;

    const query = {
      public: true,
    };

    // check already have cache product
    const cacheProduct = await CacheProductServices.getProduct(
      CacheProductServices.KEY_PRODUCT + product_id
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

      // const priceProduct = await PriceServices.getPrice(product._id);
      // const inventoryProduct = await InventoryServices.getInventory(
      //   product._id
      // );

      // if (!priceProduct || !inventoryProduct) {
      // set cache product
      CacheProductServices.setCacheProduct(
        CacheProductServices.KEY_PRODUCT + product._id,
        product
      );
      return new GetResponse(200, product).send(res);
      // }

      // set cache product
      // CacheProductServices.setCacheProduct(
      //   CacheProductServices.KEY_PRODUCT + product._id,
      //   {
      //     ...product,
      //     price: priceProduct.price,
      //     promotion_price: priceProduct.promotion_price,
      //     inventory: inventoryProduct.inventory_stock,
      //   }
      // );

      // return new GetResponse(200, {
      //   ...product,
      //   price: priceProduct.price,
      //   promotion_price: priceProduct.promotion_price,
      //   inventory: inventoryProduct.inventory_stock,
      // }).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getProductById: async (req, res) => {
    const { product_id } = req.params;

    if (!product_id) {
      return new BadResquestError().send(res);
    }

    const cacheProduct = await CacheProductServices.getProduct(
      CacheProductServices.KEY_PRODUCT + product_id
    );

    if (cacheProduct && cacheProduct._id && cacheProduct.public) {
      console.log("cache product");
      return new GetResponse(200, cacheProduct).send(res);
    }

    const select = getSelect(req.query);
    const query = {
      public: true,
    };

    try {
      const product = await ProductServices.getProductById(
        product_id,
        select,
        query
      );

      if (!product) {
        return new NotFoundError(404, "Not found product!").send(res);
      }

      // const priceProduct = await PriceServices.getPrice(product._id);
      // const inventoryProduct = await InventoryServices.getInventory(
      //   product._id
      // );

      // if (!priceProduct || !inventoryProduct) {
      // set cache product
      CacheProductServices.setCacheProduct(
        CacheProductServices.KEY_PRODUCT + product._id,
        product
      );
      return new GetResponse(200, product).send(res);
      // }

      // set cache product
      // CacheProductServices.setCacheProduct(
      //   CacheProductServices.KEY_PRODUCT + product._id,
      //   {
      //     ...product,
      //     price: priceProduct.price,
      //     promotion_price: priceProduct.promotion_price,
      //     inventory: inventoryProduct.inventory_stock,
      //   }
      // );

      // return new GetResponse(200, {
      //   ...product,
      //   price: priceProduct.price,
      //   promotion_price: priceProduct.promotion_price,
      //   inventory: inventoryProduct.inventory_stock,
      // }).send(res);
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

    const select = { title: 1, thumbnail: 1, slug: 1 };
    const query = {
      public: true,
    };

    try {
      const totalItems = await ProductServices.searchTextItems(
        search,
        category,
        query
      );

      const items = await ProductServices.searchTextWithPage(
        search,
        category,
        limitQuery,
        currentPage,
        query,
        select
      );

      const products = [];

      for (let i = 0; i < items.length; i++) {
        const product = items[i];
        const priceProduct = await PriceServices.getPrice(product._id);
        const inventoryProduct = await InventoryServices.getInventory(
          product._id
        );

        if (!priceProduct || !inventoryProduct) {
          products.push(product);
        } else {
          products.push({
            ...product,
            price: priceProduct.price,
            promotion_price: priceProduct.promotion_price,
            inventory: inventoryProduct.inventory_stock,
          });
        }
      }

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
  geInfoProduct: async (req, res) => {
    const { product_id } = req.params;

    if (!product_id) {
      return new BadResquestError().send(res);
    }

    let priceProduct = null;
    let inventoryProduct = null;

    const priceCache = await CachePriceServices.getPrice(
      CachePriceServices.KEY_PRICE + product_id
    );

    if (priceCache) {
      priceProduct = priceCache;
    }

    const inventoryCache = await CacheInventoryServices.getInventory(
      CacheInventoryServices.KEY_INVENTORY + product_id
    );

    if (inventoryCache) {
      inventoryProduct = inventoryCache;
    }

    try {
      if (!priceProduct) {
        priceProduct = await PriceServices.getPrice(product_id);

        // set cache for price of product
        CachePriceServices.setCachePrice(
          CachePriceServices.KEY_PRICE + product_id,
          priceProduct
        );
      }

      if (!inventoryProduct) {
        inventoryProduct = await InventoryServices.getInventory(product_id);

        // set cache for inventory of product
        CacheInventoryServices.setCacheInventory(
          CacheInventoryServices.KEY_INVENTORY + product_id,
          inventoryProduct
        );
      }

      if (!priceProduct || !inventoryProduct) {
        return new BadResquestError().send(res);
      }

      return new GetResponse(200, {
        inventory: inventoryProduct.inventory_stock,
        price: priceProduct.price,
        promotion_price: priceProduct.promotion_price,
      }).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
};

module.exports = UserProductController;

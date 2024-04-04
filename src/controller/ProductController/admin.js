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

const AdminProductController = {
  // [GET] ALL PRODUCT
  getProducts: async (req, res, next) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;
    const select = getSelect(req.query);
    
    try {
      const totalItems = await ProductServices.getProducts();
      if (!totalItems) {
        return new NotFoundError(404, "No product found!").send(res);
      }

      const products = await ProductServices.getProductsWithPage(
        PAGE_SIZE,
        currentPage,
        select
      );

      if (!products) {
        return new NotFoundError(404, "No product found!").send(res);
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
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;
    const gte =
      req.query.price && checkValidNumber(req.query.price)
        ? Number(req.query.price.split(".")[0])
        : null;

    const lte =
      req.query.price && checkValidNumber(req.query.price)
        ? Number(req.query.price.split(".")[1])
        : null;
    const { search } = req.query;
    const keys = Object.keys(req.query).filter(
      (query) => query !== "page" && query !== "lte" && query !== "gte"
    );

    try {
      if (keys.length > 0 || lte || gte) {
        const values = Object.values(req.query).flat();

        const totalItems = await ProductServices.getProductsFilter(
          id,
          search,
          keys,
          values,
          lte,
          gte
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
          gte
        );

        if (!products) {
          return new NotFoundError(404, "Not found product!").send(res);
        }

        return new GetResponse(200, products).send(res, {
          pagination: {
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
    const { slug } = req.params;
    try {
      const product = await ProductServices.getProduct(slug);

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

    try {
      const product = await ProductServices.getProductById(id, select);

      if (!product) {
        return new NotFoundError(404, "Not found product!").send(res);
      }

      return new GetResponse(200, product).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  // [POST] CREATE PRODUCT
  createProduct: async (req, res) => {
    const data = req.body;
    try {
      const newProduct = await ProductServices.createProduct(data);

      if (!newProduct) {
        return new BadResquestError(400, "Create product failed!").send(res);
      }

      const inventory = await InventoryServices.createInventory(newProduct._id);

      if (!inventory) {
        return new BadResquestError(400, "Create inventory failed!").send(res);
      }

      return new CreatedResponse(201, newProduct).send(res);
    } catch (error) {
      return new InternalServerError(500, error.stack).send(res);
    }
  },
  uploadThumbnail: async (req, res) => {
    if (!req.file) {
      return res.status(404).json({
        status: 404,
        message: "Image invalid",
      });
    }

    const thumbnail = req.file.path;

    return new CreatedResponse(201, thumbnail).send(res);
  },
  uploadGallery: async (req, res) => {
    if (req.files.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Image invalid",
      });
    }

    const list = req.files;
    const gallery = list.map(
      (item) => `${process.env.SERVER_ENDPOINT}/${item.path}`
    );
    return new CreatedResponse(201, gallery).send(res);
  },
  // [PATCH] A PRODUCT
  updateProduct: async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
      const product = await ProductServices.updateProduct(id, data);

      if (!product) {
        return new BadResquestError(400, "Updated product failed").send(res);
      }

      return new CreatedResponse(201, "Updated product success").send(res);
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
    try {
      const totalItems = await ProductServices.searchTextItems(
        search,
        category
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
        limitQuery
      );

      if (!products) {
        return new NotFoundError(404, `No product with title ${search}`).send(
          res
        );
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
  // [DELETE] A PRODUCT
  deleteProduct: async (req, res) => {
    const { id } = req.params;

    try {
      const product = await ProductServices.deleteProduct(id);
      if (!product) {
        return new BadResquestError(400, "Delete product failed").send(res);
      }

      return new CreatedResponse(201, "Deleted product succesfully").send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
};

module.exports = AdminProductController;

const { ProductItemServices } = require("../../services");

const {
  InternalServerError,
  NotFoundError,
  BadResquestError,
} = require("../../helpers/errorResponse");
const {
  GetResponse,
  CreatedResponse,
} = require("../../helpers/successResponse");
const { removeUndefindedObj } = require("../../helpers/NestedObjectParse");
const { isValidObjectId } = require("mongoose");

const ProductItemController = {
  getProductItems: async (req, res) => {
    const { product_id } = req.params;

    if (!product_id) {
      return new BadResquestError().send(res);
    }

    try {
      const items = await ProductItemServices.getProductItems(product_id);
      if (!items) {
        return new NotFoundError(404, "No item found!").send(res);
      }

      return new GetResponse(200, items).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  getProductItemsWithPage: async (req, res) => {
    const { product_id } = req.params;

    if (!product_id) {
      return new BadResquestError().send(res);
    }

    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;

    try {
      const totalItems = await ProductItemServices.getProductItems(product_id);
      if (!totalItems) {
        return new NotFoundError(404, "No item found!").send(res);
      }

      const items = await ProductItemServices.getProductItemsWithPage(
        product_id,
        PAGE_SIZE,
        currentPage
      );

      if (!items) {
        return new NotFoundError(404, "No item found!").send(res);
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
  getProductItem: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return new BadResquestError().send(res);
    }

    try {
      const item = await ProductItemServices.getProductItemById(id);

      if (!item) {
        return new NotFoundError(404, "Not found item!").send(res);
      }

      return new GetResponse(200, item).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  createProductItems: async (req, res) => {
    const payloads = req.body;

    if (!payloads || payloads.length === 0) {
      return new BadResquestError().send(res);
    }

    try {
      let items = [];
      for (let i = 0; i < payloads.length; i++) {
        const payloadParse = removeUndefindedObj(payloads[i]);
        let item = null;

        const { _id, ...rest } = payloadParse;

        if (isValidObjectId(_id)) {
          const variation = await ProductItemServices.getProductItemById(_id);

          if (variation) {
            item = await ProductItemServices.updateProductItem(_id, rest);
          } else {
            item = await ProductItemServices.createProductItem(rest);
          }
        } else {
          item = await ProductItemServices.createProductItem(rest);
        }

        if (item) {
          items.push(item);
        }
      }

      return new CreatedResponse(201, items).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  updateProductItem: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return new BadResquestError().send(res);
    }

    const payload = req.body;

    if (!payload) {
      return new BadResquestError().send(res);
    }

    try {
      const payloadParse = removeUndefindedObj(payload);
      const item = await ProductItemServices.updateProductItem(
        id,
        payloadParse
      );

      if (!item) {
        return new BadResquestError(400, "Update item failed").send(res);
      }

      return new CreatedResponse(201, item).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  uploadImage: (req, res) => {
    const image = `${process.env.SERVER_ENDPOINT}/${req.file.path}`;

    if (!image) {
      return new BadResquestError().send(res);
    }

    return new CreatedResponse(201, image).send(res);
  },
  deleteProductItem: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return new BadResquestError().send(res);
    }

    try {
      const item = await ProductItemServices.deleteProductItem(id);

      if (!item) {
        return new BadResquestError(400, "Delete item failed").send(res);
      }

      return new CreatedResponse(201, "Delete item success").send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
};

module.exports = ProductItemController;

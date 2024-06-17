const {
  ProductItemServices,
  ProductServices,
  InventoryServices,
  PriceServices,
} = require("../../services");

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
    const { product_id } = req.params;
    const payloads = req.body;

    if (!product_id || !payloads || payloads.length === 0) {
      return new BadResquestError().send(res);
    }

    try {
      const product = await ProductServices.getProductById(product_id);

      if (!product) {
        return new NotFoundError().send(res);
      }

      let items = [];
      // let removeItems = product.variations;
      // console.log("remove 1", removeItems)

      for (let i = 0; i < payloads.length; i++) {
        const payloadParse = removeUndefindedObj(payloads[i]);
        let item = null;
        const { _id, ...rest } = payloadParse;

        // check logic again
        if (isValidObjectId(_id)) {
          const variation = await ProductItemServices.getProductItemById(_id);

          if (variation) {
            item = await ProductItemServices.updateProductItem(_id, rest);

            // update inventory for product
            InventoryServices.updateInventory(item._id, {
              inventory_stock: rest.inventory,
            });

            // create price for product
            PriceServices.updatePrice(item._id, {
              price: rest.price,
              promotion_price: rest.promotion_price,
            });
          } else {
            item = await ProductItemServices.createProductItem(rest);

            // create inventory for product
            InventoryServices.createInventory(item._id, rest.inventory);

            // create price for product
            PriceServices.createPrice(item._id, {
              price: rest.price,
              promotion_price: rest.promotion_price,
            });
          }
        } else {
          item = await ProductItemServices.createProductItem(rest);

          // create inventory for product
          InventoryServices.createInventory(item._id, rest.inventory);

          // create price for product
          PriceServices.createPrice(item._id, {
            price: rest.price,
            promotion_price: rest.promotion_price,
          });
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
    const { product_id } = req.params;

    if (!product_id) {
      return new BadResquestError().send(res);
    }

    const payload = req.body;

    if (!payload) {
      return new BadResquestError().send(res);
    }

    try {
      const payloadParse = removeUndefindedObj(payload);
      const item = await ProductItemServices.updateProductItem(
        product_id,
        payloadParse
      );

      if (!item) {
        return new BadResquestError(400, "Update item failed").send(res);
      }

      const inventoryProduct = await InventoryServices.getInventory(item._id);
      const priceProduct = await PriceServices.getPrice(item._id);

      if (!inventoryProduct | !priceProduct) {
        return new BadResquestError().send(res);
      }

      // update inventory
      if (
        payload.inventory &&
        inventoryProduct.inventory_stock !== payload.inventory
      ) {
        InventoryServices.updateInventory(item._id, {
          inventory_stock: payload.inventory,
        });
      }

      // update price or promotion price
      if (
        (payload.price || payload.promotion_price) &&
        (priceProduct.price !== payload.price ||
          priceProduct.promotion_price !== payload.promotion_price)
      ) {
        PriceServices.updatePrice(item._id, {
          price: payload.price,
          promotion_price: payload.promotion_price,
        });
      }

      return new CreatedResponse(201, item).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  updateProductItems: async (req, res) => {
    const payload = req.body;
    if (!payload) {
      return new BadResquestError().send(res);
    }

    try {
      for (let i = 0; i < payload.length; i++) {
        const variation_id = payload[i];
        const body = { available: false };

        const item = await ProductItemServices.updateProductItem(
          variation_id,
          body
        );

        if (!item) {
          return new BadResquestError(400, "Update item failed").send(res);
        }

        const inventoryProduct = await InventoryServices.getInventory(item._id);
        const priceProduct = await PriceServices.getPrice(item._id);

        if (!inventoryProduct | !priceProduct) {
          return new BadResquestError().send(res);
        }

        // update inventory
        if (
          payload.inventory &&
          inventoryProduct.inventory_stock !== payload.inventory
        ) {
          InventoryServices.updateInventory(item._id, {
            inventory_stock: payload.inventory,
          });
        }

        // update price or promotion price
        if (
          (payload.price || payload.promotion_price) &&
          (priceProduct.price !== payload.price ||
            priceProduct.promotion_price !== payload.promotion_price)
        ) {
          PriceServices.updatePrice(item._id, {
            price: payload.price,
            promotion_price: payload.promotion_price,
          });
        }
      }

      return new CreatedResponse().send(res);
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

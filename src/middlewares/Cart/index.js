const {
  ADMIN_NOTIFI_PATH,
} = require("../../controller/NotificationController/data");
const {
  BadResquestError,
  NotFoundError,
} = require("../../helpers/errorResponse");
const {
  ProductItemServices,
  NotificationAdminServices,
  ProductServices,
  InventoryServices,
} = require("../../services");
const { NotificationTypes } = require("../../services/Notification");

const CartMiddleware = {
  checkInventoryProduct: async (req, res, next) => {
    const data = req.body;
    const { product_id, variation_id, quantity } = data;

    let product = null;

    if (variation_id) {
      product = await ProductItemServices.getProductItemById(variation_id, {
        _id: 1,
      });

      // if (!product) {
      //   return new NotFoundError().send(res);
      // }

      // if (!product.available || !product.public) {
      //   return new BadResquestError(400, "Product in not avaiable").send(res);
      // }

      // const inventoryProduct = await InventoryServices.getInventory(
      //   product._id
      // );

      // if (
      //   inventoryProduct.inventory_stock <= 0 ||
      //   inventoryProduct.inventory < quantity
      // ) {
      //   // Send notification
      //   const link = `${ADMIN_NOTIFI_PATH.PRODUCT}/${product._id}`;

      //   const dataNotification = {
      //     content: `${product.title} hết hàng`,
      //     type: NotificationTypes.Product,
      //     path: link,
      //   };

      //   await NotificationAdminServices.createNotification(dataNotification);

      //   return new BadResquestError(400, "Out of stock").send(res);
      // }
    }

    if (!variation_id) {
      product = await ProductServices.getProductById(product_id, {
        _id: 1,
      });
    }

    if (!product) {
      return new NotFoundError().send(res);
    }

    if (!product.public) {
      return new BadResquestError(400, "Product in not avaiable").send(res);
    }

    const inventoryProduct = await InventoryServices.getInventory(product._id);

    if (
      inventoryProduct.inventory_stock <= 0 ||
      inventoryProduct.inventory_stock < quantity
    ) {
      return new BadResquestError(400, "Out of stock").send(res);
    }

    next();
  },
};

module.exports = CartMiddleware;

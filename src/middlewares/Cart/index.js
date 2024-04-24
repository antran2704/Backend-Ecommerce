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
} = require("../../services");
const { NotificationTypes } = require("../../services/Notification");

const CartMiddleware = {
  checkInventoryProduct: async (req, res, next) => {
    // console.log("check inventory")
    const data = req.body;
    const { product_id, variation_id, quantity } = data;

    if (variation_id) {
      const product = await ProductItemServices.getProductItemById(
        variation_id
      );

      if (!product) {
        return new NotFoundError().send(res);
      }

      if(!product.available || !product.public) {
        return new BadResquestError(400, "Product in not avaiable").send(res)
      }

      if (product.inventory <= 0 || product.inventory < quantity) {
        // Send notification
        const link = `${ADMIN_NOTIFI_PATH.PRODUCT}/${product._id}`;

        const dataNotification = {
          content: `${product.title} hết hàng`,
          type: NotificationTypes.Product,
          path: link,
        };

        await NotificationAdminServices.createNotification(dataNotification);

        return new BadResquestError(400, "Out of stock").send(res);
      }
    }

    if (!variation_id) {
      const product = await ProductServices.getProductById(product_id);

      if (!product) {
        return new NotFoundError().send(res);
      }

      if(!product.public) {
        return new BadResquestError(400, "Product in not avaiable").send(res)
      }

      if (product.inventory <= 0 || product.inventory < quantity) {
        // Send notification
        const link = `${ADMIN_NOTIFI_PATH.PRODUCT}/${product._id}`;

        const dataNotification = {
          content: `${product.title} hết hàng`,
          type: NotificationTypes.Product,
          path: link,
        };

        await NotificationAdminServices.createNotification(dataNotification);

        return new BadResquestError(400, "Out of stock").send(res);
      }
    }

    next()
  },
};

module.exports = CartMiddleware;
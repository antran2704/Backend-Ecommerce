const { isValidObjectId } = require("mongoose");
const { ProductItem } = require("../../models");
const { getDateTime } = require("../../helpers/getDateTime");
const { NotificationAdminServices, NotificationTypes } = require("../Notification");
const { ADMIN_NOTIFI_PATH } = require("../../controller/NotificationController/data");

class ProductItemServices {
  async getProductItems(id) {
    if (!id || !isValidObjectId(id)) return null;

    const variations = ProductItem.find({ product_id: id }).lean();
    return variations;
  }

  async getProductItemsWithPage(id, pageSize, currentPage, select = {}) {
    if (!id || !isValidObjectId(id)) return null;

    const variations = ProductItem.find({ product_id: id })
      .select({ ...select })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return variations;
  }

  async getProductItemById(id, select = {}) {
    if (!id || !isValidObjectId(id)) return null;

    const variation = ProductItem.findOne({ _id: id })
      .select({ ...select })
      .lean();
    return variation;
  }

  async createProductItem(payload) {
    if (!payload) return null;

    const variation = ProductItem.create({ ...payload });

    return variation;
  }

  async updateProductItem(id, payload, query = {}) {
    if (!id || !isValidObjectId(id)) return null;

    const date = getDateTime();
    const variation = await ProductItem.findByIdAndUpdate(
      { _id: id },
      { $set: { ...payload, updatedAt: date }, ...query },
      { upsert: true, new: true }
    );

    if (variation.inventory <= 10) {
      const link = `${ADMIN_NOTIFI_PATH.PRODUCT}/${variation.product_id}`;

      const dataNotification = {
        content: `${variation.title} còn lại ${variation.inventory} sản phẩm`,
        type: NotificationTypes.Product,
        path: link,
      };

      NotificationAdminServices.createNotification(dataNotification);
    }

    return variation;
  }

  async deleteProductItem(id) {
    if (!id || !isValidObjectId(id)) return null;

    const variation = ProductItem.findByIdAndRemove({ _id: id });
    return variation;
  }
}

module.exports = new ProductItemServices();

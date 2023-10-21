const { getDateTime } = require("../../helpers/getDateTime");
const { Order } = require("../../models");

class OrderServices {
  async getOrders() {
    const orders = await Order.find({}).lean();
    return orders;
  }

  async getOrdersWithPage(pageSize, currentPage) {
    const orders = await Order.find({})
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .lean();

    return orders;
  }

  async getOrdersByUserId(user_id) {
    if (!user_id) return null;

    const orders = await Order.find({ user_id }).lean();
    return orders;
  }

  async getOrdersByUserIdWithPage(user_id, pageSize, currentPage) {
    if (!user_id) return null;

    const orders = await Order.find({ user_id })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .lean();

    return orders;
  }

  async getOrder(order_id, select) {
    if (!order_id) return null;

    const order = await Order.findById({ _id: order_id })
      .select({ ...select })
      .populate("items.product", { _id: 1, title: 1 })
      .lean();
    return order;
  }

  async createOrder(payload) {
    if (!payload) return null;

    const newOrder = await Order.create({ ...payload });
    return newOrder;
  }

  async updateOrder(order_id, payload) {
    if (!order_id) return null;
    const date = getDateTime();
    const updated = await Order.findByIdAndUpdate(
      { _id: order_id },
      { $set: { ...payload, updatedAt: date } }
    );

    return updated;
  }

  async searchOrders(searchText) {
    const totalItems = await Order.find({
      $or: [
        {
          name: { $regex: searchText, $options: "i" },
        },
        {
          email: { $regex: searchText, $options: "i" },
        },
        {
          phoneNumber: { $regex: searchText, $options: "i" },
        },
      ],
    });
    return totalItems;
  }

  async searchOrdersWithPage(searchText, pageSize, currentPage) {
    const items = await Order.find({
      $or: [
        {
          name: { $regex: searchText, $options: "i" },
        },
        {
          email: { $regex: searchText, $options: "i" },
        },
        {
          phoneNumber: { $regex: searchText, $options: "i" },
        },
      ],
    })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });
    return items;
  }

  async deleteOrder(order_id) {
    if(!order_id) return null;

    const order = await Order.findByIdAndRemove({_id: order_id});
    return order;
  }
}

module.exports = new OrderServices();

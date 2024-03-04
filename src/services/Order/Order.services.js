const { format } = require("date-fns");
const { getDateTime } = require("../../helpers/getDateTime");
const handleQueryParse = require("../../helpers/queryParse");
const { Order } = require("../../models");
const { paymentStatus } = require("../../controller/OrderController/status");

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

  async getOrdersByUserId(user_id, query = {}) {
    if (!user_id) return null;

    const orders = await Order.find({ user_id, ...query }).lean();
    return orders;
  }

  async getOrdersByUserIdWithPage(user_id, pageSize, currentPage, query = {}) {
    if (!user_id) return null;

    const orders = await Order.find({ user_id, ...query })
      .populate("items.product", {
        title: 1,
        thumbnail: 1,
        slug: 1,
      })
      .populate("items.variation", {
        title: 1,
        thumbnail: 1,
        options: 1,
      })
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
      .lean();
    return order;
  }

  async getOrderByOrderID(order_id, select) {
    if (!order_id) return null;

    const order = await Order.findOne({ order_id })
      .select({ ...select })
      .populate("items.product", {
        title: 1,
        thumbnail: 1,
        slug: 1,
      })
      .populate("items.variation", {
        title: 1,
        thumbnail: 1,
        options: 1,
      })
      .lean();
    return order;
  }

  async createOrder(payload) {
    if (!payload) return null;
    const date = new Date();
    const newOrder = await Order.create({
      order_id: format(date, "yyMMddHHmmss"),
      ...payload,
    });
    return newOrder;
  }

  async updateOrder(order_id, payload) {
    if (!order_id) return null;
    const date = getDateTime();
    const updated = await Order.findOneAndUpdate(
      { order_id },
      { $set: { ...payload, updatedAt: date } }
    );

    return updated;
  }

  async searchOrders(queryParam) {
    const queryParse = handleQueryParse(queryParam);
    const { start_date, end_date } = queryParse;
    const query = {};

    if (start_date && end_date) {
      query["date"] = {
        $and: [
          { createdAt: { $gte: new Date(start_date) } },
          { createdAt: { $lte: new Date(end_date) } },
        ],
      };
    } else if (start_date) {
      query["date"] = {
        createdAt: { $gte: new Date(start_date) },
      };
    } else if (end_date) {
      query["date"] = { createdAt: { $lte: new Date(end_date) } };
    }

    for (const key of Object.keys(queryParam)) {
      if (key === "search" && queryParam[key].length > 0) {
        const option = {
          $or: [
            { order_id: { $regex: queryParam[key], $options: "i" } },
            {
              "user_infor.name": { $regex: queryParam[key], $options: "i" },
            },
            {
              "user_infor.email": { $regex: queryParam[key], $options: "i" },
            },
            {
              "user_infor.phoneNumber": {
                $regex: queryParam[key],
                $options: "i",
              },
            },
          ],
        };

        query[key] = option;
      }

      if (key === "status" && queryParam[key].length > 0) {
        query[key] = queryParam[key];
      }

      if (key === "payment_method" && queryParam[key].length > 0) {
        query[key] = queryParam[key];
      }
    }

    const { search, date, ...rest } = query;

    const totalItems = await Order.find({ ...search, ...rest, ...date });
    return totalItems;
  }

  async searchOrdersWithPage(queryParam, pageSize, currentPage) {
    const queryParse = handleQueryParse(queryParam);
    const { start_date, end_date } = queryParse;
    const query = {};

    if (start_date && end_date) {
      query["date"] = {
        $and: [
          { createdAt: { $gte: new Date(start_date) } },
          { createdAt: { $lte: new Date(end_date) } },
        ],
      };
    } else if (start_date) {
      query["date"] = {
        createdAt: { $gte: new Date(start_date) },
      };
    } else if (end_date) {
      query["date"] = { createdAt: { $lte: new Date(end_date) } };
    }

    for (const key of Object.keys(queryParam)) {
      if (key === "search" && queryParam[key].length > 0) {
        const option = {
          $or: [
            { order_id: { $regex: queryParam[key], $options: "i" } },
            {
              "user_infor.name": { $regex: queryParam[key], $options: "i" },
            },
            {
              "user_infor.email": { $regex: queryParam[key], $options: "i" },
            },
            {
              "user_infor.phoneNumber": {
                $regex: queryParam[key],
                $options: "i",
              },
            },
          ],
        };

        query[key] = option;
      }

      if (key === "status" && queryParam[key].length > 0) {
        query[key] = queryParam[key];
      }

      if (key === "payment_method" && queryParam[key].length > 0) {
        query[key] = queryParam[key];
      }
    }

    const { search, date, ...rest } = query;

    const items = await Order.find({ ...search, ...rest, ...date })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });
    return items;
  }

  async deleteOrder(order_id) {
    if (!order_id) return null;

    const order = await Order.findByIdAndRemove({ _id: order_id });
    return order;
  }
}

module.exports = new OrderServices();

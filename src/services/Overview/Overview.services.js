const { typeStatus } = require("../../controller/OrderController/status");
const { getDateTime } = require("../../helpers/getDateTime");
const handleQueryParse = require("../../helpers/queryParse");
const { Order } = require("../../models");

class OverviewServices {
  async getOrdersToday() {
    const orders = await Order.countDocuments({
      createdAt: { $gte: new Date() },
    }).lean();

    return orders;
  }

  async getOrdersWithStatus(status) {
    if (!typeStatus[status]) return null;

    const orders = await Order.countDocuments({ status }).lean();
    return orders;
  }
}

module.exports = new OverviewServices();

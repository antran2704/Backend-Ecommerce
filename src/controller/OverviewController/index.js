const {
  InternalServerError,
  BadResquestError,
} = require("../../helpers/errorResponse");
const { GetResponse } = require("../../helpers/successResponse");
const { OverviewServices } = require("../../services");

const OverviewController = {
  getOverviewsInHome: async (req, res) => {
    try {
      const total_orders = await OverviewServices.getOrdersToday();
      const pending_orders = await OverviewServices.getOrdersWithStatus(
        "pending"
      );
      const processing_orders = await OverviewServices.getOrdersWithStatus(
        "processing"
      );
      const delivered_orders = await OverviewServices.getOrdersWithStatus(
        "delivered"
      );
      const cancle_orders = await OverviewServices.getOrdersWithStatus(
        "cancle"
      );

      return new GetResponse(200, {
        total_orders,
        pending_orders,
        processing_orders,
        delivered_orders,
        cancle_orders,
      }).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },

  getOrdersToday: async (req, res) => {
    try {
      const total_orders = await OverviewServices.getOrdersToday();

      return new GetResponse(200, total_orders).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getOrdersWithStatus: async (req, res) => {
    const { status } = req.params;

    try {
      const orders_count = await OverviewServices.getOrdersWithStatus(status);

      if (orders_count === null) {
        return new BadResquestError().send(res);
      }

      return new GetResponse(200, orders_count).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
};

module.exports = OverviewController;

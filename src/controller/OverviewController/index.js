const {
  InternalServerError,
  BadResquestError,
} = require("../../helpers/errorResponse");
const { GetResponse } = require("../../helpers/successResponse");
const { OverviewServices, GrossDateServices } = require("../../services");

const OverviewController = {
  getOverviewsInHome: async (req, res) => {
    let { date } = req.query;

    if (!date) {
      date = new Date().toLocaleDateString("en-GB");
    }

    try {
      const item = await GrossDateServices.getGrossInDay(date);

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

      if (item) {
        return new GetResponse(200, {
          total_orders: item.orders,
          gross: item.gross,
          pending_orders,
          processing_orders,
          delivered_orders,
          cancle_orders,
        }).send(res);
      }

      return new GetResponse(200, {
        total_orders: [],
        gross: 0,
        pending_orders,
        processing_orders,
        delivered_orders,
        cancle_orders,
      }).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
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

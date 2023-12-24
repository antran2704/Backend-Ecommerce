const {
  InternalServerError,
  BadResquestError,
} = require("../../helpers/errorResponse");
const {
  GetResponse,
  CreatedResponse,
} = require("../../helpers/successResponse");
const { GrossDayServices, OrderServices } = require("../../services");

const GrossDayController = {
  getGross: async (req, res) => {
    try {
      const items = await GrossDayServices.getGross();

      return new GetResponse(200, items).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getGrossInDay: async (req, res) => {
    const { date } = req.body;
    try {
      const item = await GrossDayServices.getGrossInDay(date);

      if (!item) {
        return new BadResquestError().send(res);
      }

      return new GetResponse(200, item).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getGrossWithId: async (req, res) => {
    const { gross_id } = req.params;
    try {
      const item = await GrossDayServices.getGrossWithId(gross_id);

      if (!item) {
        return new BadResquestError().send(res);
      }

      return new GetResponse(200, item).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  createGross: async (req, res) => {
    try {
      const item = await GrossDayServices.createGross();

      if (!item) {
        return new BadResquestError().send(res);
      }

      return new CreatedResponse(201, item).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  updateOrderGross: async (req, res) => {
    const { gross_id, order_id } = req.body;

    if (!gross_id || !order_id) {
      return new BadResquestError().send(res);
    }

    try {
      const order = await OrderServices.getOrder(order_id);

      if (!order) {
        return new BadResquestError().send(res);
      }
      const query = {
        $push: { orders: order_id },
      };

      const item = await GrossDayServices.updateGross(gross_id, query);

      if (!item) {
        return new BadResquestError().send(res);
      }

      return new CreatedResponse(201, item).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  updateTotalGross: async (req, res) => {
    const { gross_id, total } = req.body;

    if (!gross_id) {
      return new BadResquestError().send(res);
    }

    try {
      const query = {
        $inc: { gross: total },
      };

      const item = await GrossDayServices.updateGross(gross_id, query);

      if (!item) {
        return new BadResquestError().send(res);
      }

      return new CreatedResponse(201, item).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
};

module.exports = GrossDayController;

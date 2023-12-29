const {
  InternalServerError,
  BadResquestError,
  NotFoundError,
} = require("../../helpers/errorResponse");
const {
  GetResponse,
  CreatedResponse,
} = require("../../helpers/successResponse");
const { GrossDateServices, OrderServices } = require("../../services");

const GrossDayController = {
  getGrossInHome: async (req, res) => {
    try {
      const items = await GrossDateServices.getGrossInHome();

      return new GetResponse(200, items).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getGrossInWeek: async (req, res) => {
    const { start_date } = req.query;
    try {
      const items = await GrossDateServices.getGrossInWeek(start_date);

      if (!items) {
        return new NotFoundError().send(res);
      }

      return new GetResponse(200, items).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getGrossInDay: async (req, res) => {
    const { gross_date } = req.query;
    try {
      const item = await GrossDateServices.getGrossInDay(gross_date);

      if (!item) {
        return new NotFoundError().send(res);
      }

      return new GetResponse(200, item).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getGrossInMonth: async (req, res) => {
    const { gross_month, gross_year } = req.query;
    try {
      const items = await GrossDateServices.getGrossInMonth(
        gross_month,
        gross_year
      );

      if (!items) {
        return new NotFoundError().send(res);
      }

      return new GetResponse(200, items).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getGrossById: async (req, res) => {
    const { gross_id } = req.params;
    try {
      const item = await GrossDateServices.getGrossById(gross_id);

      if (!item) {
        return new BadResquestError().send(res);
      }

      return new GetResponse(200, item).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  createGross: async (req, res) => {
    const data = req.body;
    try {
      const item = await GrossDateServices.createGross(data);

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

      const item = await GrossDateServices.updateGross(gross_id, query);

      if (!item) {
        return new BadResquestError().send(res);
      }

      return new CreatedResponse(201, item).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  updateCancleOrder: async (req, res) => {
    const { gross_id } = req.body;

    if (!gross_id) {
      return new BadResquestError().send(res);
    }

    try {
      const query = {
        $inc: { cancle_orders: 1 },
      };

      const item = await GrossDateServices.updateGross(gross_id, query);

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
        $inc: { gross: total, delivered_orders: 1 },
      };

      const item = await GrossDateServices.updateGross(gross_id, query);

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

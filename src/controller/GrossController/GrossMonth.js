const {
  InternalServerError,
  BadResquestError,
  NotFoundError,
} = require("../../helpers/errorResponse");
const {
  GetResponse,
  CreatedResponse,
} = require("../../helpers/successResponse");
const { GrossMonthServices, OrderServices } = require("../../services");

const GrossMonthController = {
  getGrossByYear: async (req, res) => {
    const { year } = req.query;

    try {
      const items = await GrossMonthServices.getGross(year);

      if (!items) {
        return new GetResponse(200, {
          orders_delivered: 0,
          orders_cancle: 0,
          gross: 0,
        }).send(res);
      }

      return new GetResponse(200, items).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getGrossByMonth: async (req, res) => {
    const { gross_month, gross_year } = req.query;
    try {
      const item = await GrossMonthServices.getGrossByMonth(gross_month, gross_year);

      if (!item) {
        return new GetResponse(200, {
          orders_delivered: 0,
          orders_cancle: 0,
          gross: 0,
        }).send(res);
      }

      return new GetResponse(200, item).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getGrossById: async (req, res) => {
    const { gross_id } = req.params;
    try {
      const item = await GrossMonthServices.getGrossById(gross_id);

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
      const item = await GrossMonthServices.createGross();

      if (!item) {
        return new BadResquestError().send(res);
      }

      return new CreatedResponse(201, item).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  updateOrderGross: async (req, res) => {
    const { gross_id } = req.body;

    if (!gross_id) {
      return new BadResquestError().send(res);
    }

    try {
      const query = {
        $inc: { orders: 1 },
      };

      const item = await GrossMonthServices.updateGross(gross_id, query);

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
        $inc: { orders_cancle: 1 },
      };

      const item = await GrossMonthServices.updateGross(gross_id, query);

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
        $inc: { gross: total, orders_delivered: 1 },
      };

      const item = await GrossMonthServices.updateGross(gross_id, query);

      if (!item) {
        return new BadResquestError().send(res);
      }

      return new CreatedResponse(201, item).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
};

module.exports = GrossMonthController;

const { DiscountServices } = require("../../services");
const {
  InternalServerError,
  NotFoundError,
  BadResquestError,
} = require("../../helpers/errorResponse");
const {
  GetResponse,
  CreatedResponse,
} = require("../../helpers/successResponse");

const DiscountController = {
  createDiscount: async (req, res) => {
    const payload = req.body;
    const { discount_start_date, discount_end_date, discount_code } = payload;

    if (!discount_code || !discount_start_date || !discount_end_date) {
      return new BadResquestError(400, "Invalid payload").send(res);
    }

    const discount = await DiscountServices.getDiscountByCode(discount_code);

    if(discount) {
      return new BadResquestError(400, "Discount is exited").send(res);
    }

    const validDate = DiscountServices.validDateDiscount(
      discount_start_date,
      discount_end_date
    );

    if (!validDate) {
      return new BadResquestError(400, "Invalid discount date").send(res);
    }
    try {
      const newDiscount = await DiscountServices.createDiscount(payload);

      if (!newDiscount) {
        return new BadResquestError(400, "Create dicount failed").send(res);
      }

      return new CreatedResponse(201, "Create discount success").send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  getDiscounts: async (req, res) => {
    try {
      const discounts = await DiscountServices.getDiscounts();

      if (!discounts) {
        return new NotFoundError(404, "Discounts not found").send(res);
      }

      return new GetResponse(200, discounts).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  getDiscount: async (req, res) => {
    const { discount_code } = req.params;

    if (!discount_code) {
      return new BadResquestError(400, "Invalid discount code").send(res);
    }

    try {
      const discount = await DiscountServices.getDiscountByCode(discount_code);
      if (!discount) {
        return new NotFoundError(404, "Discount not found").send(res);
      }

      return new GetResponse(200, discount).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  updateDiscount: async (req, res) => {
    const { discount_code } = req.params;
    const payload = req.body;

    if (!discount_code) {
      return new BadResquestError(400, "Invalid discount code").send(res);
    }

    try {
      const discount = await DiscountServices.updateDiscount(
        discount_code,
        payload
      );

      if (!discount) {
        return new BadResquestError(400, "Updated discount failed").send(res);
      }
      return new CreatedResponse(201, "Updated discount success").send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
};

module.exports = DiscountController;

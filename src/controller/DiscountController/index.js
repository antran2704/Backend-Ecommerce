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
const getSelect = require("../../helpers/getSelect");
const { isValidDate } = require("../../helpers/getDateTime");

const DISCOUT_TYPE = ["fixed_amount", "percentage"];
const DISCOUNT_APPLIES = ["all", "specific"];

const DiscountController = {
  getDiscounts: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = req.query.page ? Number(req.query.page) : 1;
    const select = getSelect(req.query);

    try {
      const totalItems = await DiscountServices.getDiscounts(select);

      const discounts = await DiscountServices.getDiscountsWithPage(
        PAGE_SIZE,
        currentPage,
        select
      );

      return new GetResponse(200, discounts).send(res, {
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getDiscount: async (req, res) => {
    const { discount_code } = req.body;

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
  getDiscountById: async (req, res) => {
    const { discount_id } = req.params;

    if (!discount_id) {
      return new BadResquestError(400, "Invalid discount id").send(res);
    }

    try {
      const discount = await DiscountServices.getDiscountById(discount_id);
      if (!discount) {
        return new NotFoundError(404, "Discount not found").send(res);
      }

      return new GetResponse(200, discount).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  createDiscount: async (req, res) => {
    const payload = req.body;
    const {
      discount_start_date,
      discount_end_date,
      discount_code,
      discount_type,
      discount_applies,
    } = payload;

    if (!discount_code || !discount_start_date || !discount_end_date) {
      return new BadResquestError(400, "Invalid payload").send(res);
    }

    if (
      (discount_type && !DISCOUT_TYPE.includes(discount_type)) ||
      (discount_applies && !DISCOUNT_APPLIES.includes(discount_applies))
    ) {
      return new BadResquestError(400, "Invalid type/applies discount").send(
        res
      );
    }

    if (!isValidDate(discount_start_date) || !isValidDate(discount_end_date)) {
      return new BadResquestError(400, "Invalid discount date").send(res);
    }

    const validDate = DiscountServices.validDateDiscount(
      discount_start_date,
      discount_end_date
    );

    if (!validDate) {
      return new BadResquestError(400, "Invalid discount date").send(res);
    }

    try {
      const discount = await DiscountServices.getDiscountByCode(discount_code);

      if (discount) {
        return new BadResquestError(400, "Discount is exited").send(res);
      }
      const newDiscount = await DiscountServices.createDiscount(payload);

      if (!newDiscount) {
        return new BadResquestError(400, "Create dicount failed").send(res);
      }

      return new CreatedResponse(201, "Create discount success").send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  useDiscount: async (req, res) => {
    // get discount from middleware
    const { discount } = req;
    const { total, user_id } = req.body;

    if (!user_id || !isValidObjectId(user_id)) {
      return new BadResquestError().send(res);
    }

    try {
      let total_discount = 0;

      if (discount.discount_type === "percentage") {
        total_discount = total - (total * discount.discount_value) / 100;
      } else {
        total_discount = total - discount.discount_value;
      }

      DiscountServices.updateUsedDiscount(discount.discount_code, user_id);

      return new GetResponse(200, {
        discount,
        total,
        total_discount,
      }).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  searchDiscounts: async (req, res) => {
    const { search, start_date, end_date, page } = req.query;
    const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 16;
    const currentPage = page ? Number(page) : 1;

    try {
      const totalItems = await DiscountServices.searchDiscounts(
        search,
        start_date,
        end_date
      );

      if (!totalItems) {
        return new NotFoundError(404, "Not found discount").send(res);
      }

      const discounts = await DiscountServices.searchDiscountsWithPage(
        search,
        start_date,
        end_date,
        PAGE_SIZE,
        currentPage
      );

      if (!discounts) {
        return new NotFoundError(404, "Not found discount").send(res);
      }

      return new GetResponse(200, discounts).send(res, {
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  updateDiscount: async (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    const {
      discount_start_date,
      discount_end_date,
      discount_code,
      discount_type,
      discount_applies,
    } = payload;

    if (!id || !discount_code) {
      return new BadResquestError(400, "Invalid discount code").send(res);
    }

    if (
      (discount_type && !DISCOUT_TYPE.includes(discount_type)) ||
      (discount_applies && !DISCOUNT_APPLIES.includes(discount_applies))
    ) {
      return new BadResquestError(400, "Invalid type/applies discount").send(
        res
      );
    }

    if (
      (discount_end_date && !isValidDate(discount_end_date)) ||
      (discount_start_date && !isValidDate(discount_start_date))
    ) {
      return new BadResquestError(400, "Invalid discount date").send(res);
    }

    const validDate = DiscountServices.validDateDiscount(
      discount_start_date,
      discount_end_date
    );

    if (!validDate) {
      return new BadResquestError(400, "Invalid discount date").send(res);
    }

    const queryCheckDiscount = {
      _id: { $ne: id },
      discount_code,
    };

    try {
      const isExitDiscount = await DiscountServices.getDiscount(
        queryCheckDiscount,
        { discount_code: 1 }
      );

      console.log("check:::", isExitDiscount);

      if (isExitDiscount) {
        return new BadResquestError(400, "Discount is exited").send(res);
      }

      const discount = await DiscountServices.updateDiscount(id, payload);

      if (!discount) {
        return new BadResquestError(400, "Updated discount failed").send(res);
      }
      return new CreatedResponse(201, discount).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  uploadThumbnail: async (req, res) => {
    const thumbnail = req.file.path;
    return new CreatedResponse(201, thumbnail).send(res);
  },
  deleteDiscount: async (req, res) => {
    const { discount_id } = req.params;

    if (!discount_id) {
      return new BadResquestError().send(res);
    }

    try {
      const discount = await DiscountServices.deleteDiscount(discount_id);

      if (!discount) {
        return new BadResquestError().send(res);
      }

      return new CreatedResponse(201, "Delete success discount").send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
};

module.exports = DiscountController;

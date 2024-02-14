const { isValidObjectId } = require("mongoose");
const {
  InternalServerError,
  BadResquestError,
} = require("../../helpers/errorResponse");
const { DiscountServices } = require("../../services");

const DiscountMiddleware = {
  checkDiscount: async (req, res, next) => {
    const { discount_code, user_id, total } = req.body;

    if (!discount_code) {
      return new BadResquestError().send(res);
    }

    try {
      const discount = await DiscountServices.getDiscountByCode(discount_code, {
        discount_code: 1,
        discount_type: 1,
        discount_value: 1,
        discount_start_date: 1,
        discount_end_date: 1,
        discount_min_value: 1,
        discount_active: 1,
        discount_max_uses: 1,
        discount_per_user: 1,
        discount_user_used: 1,
      });

      if (!discount) {
        return new BadResquestError(400, "Discount not exit").send(res);
      }

      if (new Date() < discount.discount_start_date) {
        return new BadResquestError(400, "Discount can't use now").send(res);
      }

      const vailidDiscount = DiscountServices.validDateDiscount(
        discount.discount_start_date,
        discount.discount_end_date
      );
      
      if (
        !vailidDiscount ||
        !discount.discount_active ||
        discount.discount_max_uses <= 0
      ) {
        return new BadResquestError(
          400,
          "Discount invalid or discount expried"
        ).send(res);
      }

      if (total < discount.discount_min_value) {
        return new BadResquestError(400, "Total not enough use discount").send(
          res
        );
      }

      const isUsed = await DiscountServices.checkUsedDiscount(
        discount_code,
        user_id
      );

      // update used discount
      if (isUsed) {
        const countUsed = discount.discount_user_used.find(
          (user) => user.user_id.toString() === user_id
        );

        if (countUsed.count >= discount.discount_per_user) {
          return new BadResquestError(400, "Discount was used max").send(res);
        }
      }

      req.discount = discount;
      next();
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
};

module.exports = DiscountMiddleware;

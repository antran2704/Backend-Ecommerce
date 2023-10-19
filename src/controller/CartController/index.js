const { isValidObjectId } = require("mongoose");
const {
  CartServices,
  UserServices,
  ProductServices,
  DiscountServices,
} = require("../../services");
const {
  InternalServerError,
  NotFoundError,
  BadResquestError,
} = require("../../helpers/errorResponse");
const {
  GetResponse,
  CreatedResponse,
} = require("../../helpers/successResponse");

const CartController = {
  getCart: async (req, res) => {
    const { user_id } = req.params;
    console.log(user_id);
    if (!user_id) {
      return new BadResquestError(400, "User_id params not found").send(res);
    }

    try {
      const cart = await CartServices.getCartByUserId(user_id);

      if (!cart) {
        return new NotFoundError(404, "Not found cart").send(res);
      }

      return new GetResponse(200, cart).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },

  updateCart: async (req, res) => {
    const { user_id } = req.params;
    const data = req.body;
    const { product_id, quantity } = data;

    if (!user_id || !data) {
      return new BadResquestError().send(res);
    }

    try {
      const user = await UserServices.getUser(user_id);

      if (!user) {
        return new NotFoundError(404, "Not found user").send(res);
      }

      const cart = await CartServices.getCartByUserId(user_id);

      if (!cart) {
        return new NotFoundError(404, "Not found cart").send(res);
      }

      if (!product_id || !isValidObjectId(product_id)) {
        return new NotFoundError(400, "Object id invalid").send(res);
      }

      const product = await ProductServices.getProductById(data.product_id, {
        inventory: 1,
      });

      if (!product) {
        return new NotFoundError(404, "Not found product").send(res);
      }

      if (quantity > product.inventory) {
        return new BadResquestError(
          400,
          "Quantity order bigger than inventory"
        ).send(res);
      }

      const updatedCart = await CartServices.updateItemsCart(user_id, data);

      if (!updatedCart) {
        return new BadResquestError(400, "Updated cart failed").send(res);
      }

      return new CreatedResponse(201, { data, user_id }).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  useDiscount: async (req, res) => {
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
        discount_user_used: 1
      });

      if (!discount) {
        return new BadResquestError(400, "Discount not found").send(res);
      }

      if (new Date() < discount.discount_start_date) {
        return new BadResquestError(400, "Discount can't use now").send(res);
      }

      const vailidDiscount = DiscountServices.validDateDiscount(
        discount.discount_start_date,
        discount.discount_end_date
      );

      if (!vailidDiscount || !discount.discount_active || discount.discount_max_uses <= 0) {
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
          (user) => user.user_id === user_id
        );

        if (countUsed.count >= discount.discount_per_user) {
          return new BadResquestError(400, "Discount was used max").send(res);
        }

        DiscountServices.updateUsedCountDiscount(discount_code, user_id);
      } else {
        DiscountServices.updateUsedDiscount(discount_code, user_id);
      }

      if (discount.discount_type === "percentage") {
        const total_discount = total - discount.discount_value;
        return new GetResponse(200, {
          discount_code,
          total,
          total_discount,
        }).send(res);
      }

      const total_discount = total * (discount.discount_value / 100);
      return new GetResponse(200, {
        discount_code,
        total,
        total_discount,
      }).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },

  deleteItemCart: async (req, res) => {
    const { user_id } = req.params;
    const data = req.body;

    if (!user_id || !data) {
      return new BadResquestError().send(res);
    }

    const validUserId = isValidObjectId(user_id);

    if (!validUserId) {
      return new BadResquestError(400, "Object id invalid").send(res);
    }

    try {
      const user = await UserServices.getUser(user_id);

      if (!user) {
        return new NotFoundError(404, "Not found user").send(res);
      }

      const cart = await CartServices.getCartByUserId(user_id);

      if (!cart) {
        return new NotFoundError(404, "Not found cart").send(res);
      }

      const updatedCart = await CartServices.deleteItemCart(user_id, data);

      if (!updatedCart) {
        return new BadResquestError(400, "Deleted item in cart failed").send(
          res
        );
      }

      return new CreatedResponse(201, "Delete item success").send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  deleteAllItemCart: async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
      return new BadResquestError().send(res);
    }

    const validUserId = isValidObjectId(user_id);

    if (!validUserId) {
      return new BadResquestError(400, "Object id invalid").send(res);
    }

    try {
      const user = await UserServices.getUser(user_id);

      if (!user) {
        return new NotFoundError(404, "Not found user").send(res);
      }

      const cart = await CartServices.getCartByUserId(user_id);

      if (!cart) {
        return new NotFoundError(404, "Not found cart").send(res);
      }

      const updatedCart = await CartServices.deleteAllItemCart(user_id);

      if (!updatedCart) {
        return new BadResquestError(
          400,
          "Deleted all items in cart failed"
        ).send(res);
      }

      return new CreatedResponse(201, "Delete all items success").send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
};

module.exports = CartController;

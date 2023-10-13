const { CartServices, UserServices } = require("../../services");
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

      console.log("payload:::", data);

      const updatedCart = await CartServices.updateItemsCart(user_id, data);

      if (!updatedCart) {
        return new BadResquestError(400, "Updated cart failed").send(res);
      }

      return new CreatedResponse(201, { data, user_id }).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
};

module.exports = CartController;

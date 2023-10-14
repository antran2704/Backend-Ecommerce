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
const { isValidObjectId } = require("mongoose");

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

      const updatedCart = await CartServices.updateItemsCart(user_id, data);

      if (!updatedCart) {
        return new BadResquestError(400, "Updated cart failed").send(res);
      }

      return new CreatedResponse(201, { data, user_id }).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
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
      return new InternalServerError(error.stack).send(res);
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
      return new InternalServerError(error.stack).send(res);
    }
  },
};

module.exports = CartController;

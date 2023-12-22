const { isValidObjectId } = require("mongoose");
const {
  CartServices,
  UserServices,
  ProductServices,
  DiscountServices,
  ProductItemServices,
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
    const { product_id, variation_id, quantity } = data;

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
        price: 1,
        promotion_price: 1,
      });

      if (!product) {
        return new NotFoundError(404, "Not found product").send(res);
      }

      data.price =
        product.promotion_price > 0 ? product.promotion_price : product.price;

      if (variation_id && isValidObjectId(variation_id)) {
        const variationProduct = await ProductItemServices.getProductItemById(
          variation_id,
          { inventory: 1, price: 1, promotion_price: 1 }
        );

        if (!variationProduct) {
          return new NotFoundError(404, "Not found variation product").send(
            res
          );
        }

        if (quantity > variationProduct.inventory) {
          return new BadResquestError(
            400,
            "Quantity order bigger than inventory type variation"
          ).send(res);
        }

        data.price =
          variationProduct.promotion_price > 0
            ? variationProduct.promotion_price
            : variationProduct.price;
            
      } else if (quantity > product.inventory) {
        return new BadResquestError(
          400,
          "Quantity order bigger than inventory"
        ).send(res);
      }

      const updatedCart = await CartServices.updateItemsCart(user_id, data);

      if (!updatedCart) {
        return new BadResquestError(400, "Updated cart failed").send(res);
      }

      const totalItems = updatedCart.cart_products.length;
      const totalPrice = CartServices.getTotalPrice(updatedCart.cart_products);

      const updated = await CartServices.updateCart(user_id, {
        cart_count: totalItems,
        cart_total: totalPrice,
      });

      if (!updated) {
        return new BadResquestError(400, "Updated cart failed").send(res);
      }

      return new CreatedResponse(201, updated).send(res);
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

      const totalItems = updatedCart.cart_products.length;
      const totalPrice = CartServices.getTotalPrice(updatedCart.cart_products);

      const updated = await CartServices.updateCart(user_id, {
        cart_count: totalItems,
        cart_total: totalPrice,
      });

      if (!updated) {
        return new BadResquestError(400, "Updated cart failed").send(res);
      }

      return new CreatedResponse(201, updated).send(res);
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

      return new CreatedResponse(201, updatedCart).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
};

module.exports = CartController;

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

      const cart_products = await CartServices.getItemsInCart(cart._id);

      return new GetResponse(200, {
        _id: cart._id,
        cart_userId: cart.cart_userId,
        cart_status: cart.cart_status,
        cart_count: cart.cart_count,
        cart_total: cart.cart_total,
        cart_products,
      }).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  increaseCart: async (req, res) => {
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

      let inventoryProduct = 0;

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

        data.price =
          variationProduct.promotion_price > 0
            ? variationProduct.promotion_price
            : variationProduct.price;

        inventoryProduct = variationProduct.inventory;
      } else {
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
        inventoryProduct = product.inventory;
      }

      const checkProductInCart = await CartServices.checkProductInCart(
        cart._id,
        product_id,
        variation_id
      );

      if (
        checkProductInCart &&
        inventoryProduct < checkProductInCart.quantity + quantity
      ) {
        return new BadResquestError(
          400,
          "Quantity order bigger than inventory"
        ).send(res);
      }

      const updatedCart = await CartServices.increaseItemsCart(
        user_id,
        cart._id,
        data
      );

      if (!updatedCart) {
        return new BadResquestError(400, "Updated cart failed").send(res);
      }

      const totalItems = await CartServices.getItemsInCart(cart._id);
      const totalPrice = CartServices.getTotalPrice(totalItems);

      const updated = await CartServices.updateCart(user_id, {
        cart_count: totalItems.length,
        cart_total: totalPrice,
      });

      if (!updated) {
        return new BadResquestError(400, "Updated cart failed").send(res);
      }

      return new CreatedResponse(201, {
        cart_userId: updated.cart_userId,
        cart_status: updated.cart_status,
        cart_count: updated.cart_count,
        cart_total: updated.cart_total,
        cart_products: totalItems,
      }).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
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

      let inventoryProduct = 0;

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

        data.price =
          variationProduct.promotion_price > 0
            ? variationProduct.promotion_price
            : variationProduct.price;

        inventoryProduct = variationProduct.inventory;
      } else {
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
        inventoryProduct = product.inventory;
      }

      const checkProductInCart = await CartServices.checkProductInCart(
        cart._id,
        product_id,
        variation_id
      );

      if (checkProductInCart && inventoryProduct < quantity) {
        return new BadResquestError(
          400,
          "Quantity order bigger than inventory"
        ).send(res);
      }

      const updatedCart = await CartServices.updateItemsCart(
        user_id,
        cart._id,
        data
      );

      if (!updatedCart) {
        return new BadResquestError(400, "Updated cart failed").send(res);
      }

      const totalItems = await CartServices.getItemsInCart(cart._id);
      const totalPrice = CartServices.getTotalPrice(totalItems);

      const updated = await CartServices.updateCart(user_id, {
        cart_count: totalItems.length,
        cart_total: totalPrice,
      });

      if (!updated) {
        return new BadResquestError(400, "Updated cart failed").send(res);
      }

      return new CreatedResponse(201, {
        cart_userId: updated.cart_userId,
        cart_status: updated.cart_status,
        cart_count: updated.cart_count,
        cart_total: updated.cart_total,
        cart_products: totalItems,
      }).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  checkInventoryItem: async (req, res) => {
    const { user_id } = req.params;
    const data = req.body;
    
    if (!user_id || !data) {
      return new BadResquestError().send(res);
    }

    try {
      const cart = await CartServices.getCartByUserId(user_id);

      if (!cart) {
        return new NotFoundError(404, "Not found cart").send(res);
      }

      for (let i = 0; i < data.cart_products.length; i++) {
        const item = data.cart_products[0];

        if (item.variation) {
          const product = await ProductItemServices.getProductItemById(
            item.variation
          );

          if (!product || product.inventory <= 0) {
            return new BadResquestError(400, "Out of stock").send(res);
          }
        }

        if (item.product) {
          const product = await ProductServices.getProductById(item.product);

          if (!product || product.inventory <= 0) {
            return new BadResquestError(400, "Out of stock").send(res);
          }
        }
      }

      return new GetResponse().send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  deleteItemCart: async (req, res) => {
    const { user_id } = req.params;
    const data = req.body; //body = { product_id, variation_id }

    if (!user_id || !isValidObjectId(user_id) || !data) {
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

      const updatedCart = await CartServices.deleteItemCart(cart._id, data);

      if (!updatedCart) {
        return new BadResquestError(400, "Deleted item in cart failed").send(
          res
        );
      }

      const totalItems = await CartServices.getItemsInCart(cart._id);
      const totalPrice = CartServices.getTotalPrice(totalItems);

      const updated = await CartServices.updateCart(user_id, {
        cart_count: totalItems.length,
        cart_total: totalPrice,
      });

      if (!updated) {
        return new BadResquestError(400, "Updated cart failed").send(res);
      }

      return new CreatedResponse(201, {
        cart_userId: updated.cart_userId,
        cart_status: updated.cart_status,
        cart_count: updated.cart_count,
        cart_total: updated.cart_total,
        cart_products: totalItems,
      }).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  deleteAllItemCart: async (req, res) => {
    const { user_id } = req.params;

    if (!user_id || !isValidObjectId(user_id)) {
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

      const updatedCart = await CartServices.deleteAllItemCart(cart._id);

      if (!updatedCart) {
        return new BadResquestError(
          400,
          "Deleted all items in cart failed"
        ).send(res);
      }

      const updated = await CartServices.updateCart(user_id, {
        cart_count: 0,
        cart_total: 0,
      });

      if (!updated) {
        return new BadResquestError(400, "Updated cart failed").send(res);
      }

      return new CreatedResponse(201, {
        cart_userId: updated.cart_userId,
        cart_status: updated.cart_status,
        cart_count: updated.cart_count,
        cart_total: updated.cart_total,
        cart_products: [],
      }).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
};

module.exports = CartController;

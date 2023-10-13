const { Cart } = require("../../models");
const convertObjectToString = require("../../helpers/convertObjectString");

class CartServices {
  async getCartByUserId(user_id) {
    if (!user_id) return null;

    const cart = await Cart.findOne({
      cart_userId: convertObjectToString(user_id),
    });
    return cart;
  }

  async createCart(user_id) {
    if (!user_id) return null;

    const newCart = await Cart.create({ cart_userId: user_id });
    return newCart;
  }

  async updateItemsCart(user_id, payload) {
    if (!user_id) return null;

    const { shop_id, product_id, variation, quantity, price } = payload;

    // check shop is exit
    const shopInCart = await Cart.findOne({
      cart_userId: convertObjectToString(user_id),
      cart_products: { $elemMatch: { shop_id } },
    });

    // case 1: chưa có shop và san pham tạo mới
    if (!shopInCart) {
      console.log("case 1::: chưa có shop và san pham tạo mới");
      const updatedCart = await Cart.findOneAndUpdate(
        {
          cart_userId: convertObjectToString(user_id),
        },
        {
          $push: {
            cart_products: {
              shop_id,
              products: [{ product_id, variation, quantity, price }],
            },
          },
        }
      );

      return updatedCart;
    }

    // case 2: đã có shop và có sản phẩm với id
    const checkProductInCart = await Cart.findOne({
      cart_userId: convertObjectToString(user_id),
      cart_products: { $elemMatch: { shop_id } },
      "cart_products.products": {
        $elemMatch: { $and: [{ product_id }, { variation }] },
      },
    });

    // case 3: đã có shop và chưa có sản phẩm với id
    if (!checkProductInCart) {
      console.log("case 3::: đã có shop và chưa có sản phẩm với id");
      const updatedCart = await Cart.findOneAndUpdate(
        {
          cart_userId: convertObjectToString(user_id),
          cart_products: { $elemMatch: { shop_id } },
        },
        {
          $push: {
            "cart_products.$.products": {
              product_id,
              variation,
              quantity,
              price,
            },
          },
        }
      );

      return updatedCart;
    } else {
      console.log("case 2::: đã có shop và có sản phẩm với id");

      const updatedCart = await Cart.findOneAndUpdate(
        {
          cart_userId: convertObjectToString(user_id),
          cart_products: { $elemMatch: { shop_id } },
          "cart_products.products": {
            $elemMatch: { $and: [{ product_id }, { variation }] },
          },
        },
        {
          $set: { "cart_products.$[i].products.$[j].quantity": quantity },
        },
        {
          arrayFilters: [
            {
              "i.shop_id": shop_id,
            },
            {
              "j.product_id": product_id,
            },
          ],
        }
      );
      return updatedCart;
    }
  }
}

module.exports = new CartServices();

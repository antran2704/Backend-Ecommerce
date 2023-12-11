const { Cart } = require("../../models");
const convertObjectToString = require("../../helpers/convertObjectString");
const { getDateTime } = require("../../helpers/getDateTime");

class CartServices {
  async getCartByUserId(user_id) {
    if (!user_id) return null;

    const cart = await Cart.findOne({
      cart_userId: convertObjectToString(user_id),
    })
      .populate("cart_products.product_id", {
        inventory: 1,
        title: 1,
        thumbnail: 1,
      })
      .populate("cart_products.variation_id", {
        inventory: 1,
        title: 1,
        thumbnail: 1,
      });
    return cart;
  }

  async createCart(user_id) {
    if (!user_id) return null;

    const newCart = await Cart.create({ cart_userId: user_id });
    return newCart;
  }

  async checkShopInCart(user_id, shop_id) {
    if (!user_id || !shop_id) return null;

    const shopInCart = await Cart.findOne({
      cart_userId: convertObjectToString(user_id),
      cart_products: { $elemMatch: { shop_id } },
    });

    return shopInCart;
  }

  getTotalPrice(items) {
    const total = items.reduce((total, item) => {
      return (total += item.quantity * item.price);
    }, 0);

    return total;
  }

  async checkProductInCart(user_id, product_id, variation_id) {
    if (!user_id || !product_id) return null;

    const productInCart = await Cart.findOne({
      cart_userId: convertObjectToString(user_id),
      cart_products: {
        $elemMatch: { $and: [{ product_id }, { variation_id }] },
      },
    });

    return productInCart;
  }

  async updateCart(user_id, payload) {
    if (!user_id) return null;
    
    const date = getDateTime();
    const updatedCart = await Cart.findOneAndUpdate(
      {
        cart_userId: convertObjectToString(user_id),
      },
      {
        $set: { ...payload, updatedAt: date },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return updatedCart;
  }

  async updateItemsCart(user_id, payload) {
    if (!user_id) return null;
    const date = getDateTime();
    const { product_id, variation_id, quantity, price, options } = payload;

    // check shop is exit
    // const shopInCart = await this.checkShopInCart(user_id, shop_id);

    // case 1: chưa có shop và san pham tạo mới
    // if (!shopInCart) {
    //   console.log("case 1::: chưa có shop và san pham tạo mới");
    //   const updatedCart = await Cart.findOneAndUpdate(
    //     {
    //       cart_userId: convertObjectToString(user_id),
    //     },
    //     {
    //       $push: {
    //         cart_products: {
    //           shop_id,
    //           products: [{ product_id, variation, quantity, price }],
    //         },
    //       },
    //     }
    //   );

    //   return updatedCart;
    // }

    // case 2: đã có shop và có sản phẩm với id
    const productInCart = await this.checkProductInCart(
      user_id,
      product_id,
      variation_id
    );

    // case 3: đã có shop và chưa có sản phẩm với id
    if (!productInCart) {
      console.log("case 3::: chưa có sản phẩm với id");
      const updatedCart = await Cart.findOneAndUpdate(
        {
          cart_userId: convertObjectToString(user_id),
        },
        {
          $push: {
            cart_products: {
              product_id,
              variation_id,
              quantity,
              price,
              options,
            },
          },
          $set: { updatedAt: date },
        },
        { new: true, upsert: true }
      );

      return updatedCart;
    } else {
      console.log("case 2::: có sản phẩm với id");

      const updatedCart = await Cart.findOneAndUpdate(
        {
          cart_userId: convertObjectToString(user_id),
        },
        {
          $set: { "cart_products.$[i].quantity": quantity, updatedAt: date },
        },
        {
          arrayFilters: [
            {
              $and: [
                { "i.product_id": product_id },
                { "i.variation_id": variation_id },
              ],
            },
          ],
          new: true,
          upsert: true,
        }
      );
      return updatedCart;
    }
  }

  async deleteItemCart(user_id, payload) {
    if (!user_id) return null;

    const { product_id, variation_id } = payload;

    if (!product_id) return null;

    const productInCart = await this.checkProductInCart(
      user_id,
      product_id,
      variation_id
    );

    if (!productInCart) return null;

    const date = getDateTime();
    const updatedCart = await Cart.findOneAndUpdate(
      {
        cart_userId: convertObjectToString(user_id),
      },
      {
        $pull: { cart_products: { product_id, variation_id } },
        $set: { updatedAt: date },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return updatedCart;
  }

  async deleteAllItemCart(user_id) {
    if (!user_id) return null;
    const date = getDateTime();

    const updatedCart = await Cart.findOneAndUpdate(
      {
        cart_userId: convertObjectToString(user_id),
      },
      {
        $set: {
          cart_products: [],
          cart_count: 0,
          cart_total: 0,
          updatedAt: date,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
    return updatedCart;
  }
}

module.exports = new CartServices();

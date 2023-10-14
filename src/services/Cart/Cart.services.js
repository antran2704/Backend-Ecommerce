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

  async checkShopInCart(user_id, shop_id) {
    if (!user_id || !shop_id) return null;

    const shopInCart = await Cart.findOne({
      cart_userId: convertObjectToString(user_id),
      cart_products: { $elemMatch: { shop_id } },
    });

    return shopInCart;
  }

  async checkProductInCart(user_id, shop_id, product_id, variation) {
    if (!user_id || !shop_id || !product_id) return null;

    const productInCart = await Cart.findOne({
      cart_userId: convertObjectToString(user_id),
      cart_products: { $elemMatch: { shop_id } },
      "cart_products.products": {
        $elemMatch: { $and: [{ product_id }, { variation }] },
      },
    });

    return productInCart;
  }

  async updateItemsCart(user_id, payload) {
    if (!user_id) return null;

    const { shop_id, product_id, variation, quantity, price } = payload;

    if (!shop_id || !product_id) return null;

    // check shop is exit
    const shopInCart = await this.checkShopInCart(user_id, shop_id);

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
    const productInCart = await this.checkProductInCart(
      user_id,
      shop_id,
      product_id,
      variation
    );

    // case 3: đã có shop và chưa có sản phẩm với id
    if (!productInCart) {
      console.log("case 3::: đã có shop và chưa có sản phẩm với id");
      const updatedCart = await Cart.findOneAndUpdate(
        {
          cart_userId: convertObjectToString(user_id),
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

  async deleteItemCart(user_id, payload) {
    if (!user_id) return null;

    const { shop_id, product_id, variation } = payload;

    if (!shop_id || !product_id) return null;

    const shopInCart = await this.checkShopInCart(user_id, shop_id);

    if (!shopInCart) return null;

    const productInCart = await this.checkProductInCart(
      user_id,
      shop_id,
      product_id,
      variation
    );

    if (!productInCart) return null;

    const productsInShop = shopInCart.cart_products.find(
      (shop) => shop.shop_id === shop_id
    );

    const countProduct = productsInShop.products.length;

    if (countProduct <= 1) {
      const updatedCart = await Cart.findOneAndUpdate(
        {
          cart_userId: convertObjectToString(user_id),
        },
        {
          $pull: { cart_products: { shop_id } },
        }
      );

      return updatedCart;
    }

    const updatedCart = await Cart.findOneAndUpdate(
      {
        cart_userId: convertObjectToString(user_id),
      },
      {
        $pull: { "cart_products.$[i].products": { product_id } },
      },
      {
        arrayFilters: [
          {
            "i.shop_id": shop_id,
          },
        ],
      }
    );
    return updatedCart;
  }

  async deleteAllItemCart(user_id) {
    if (!user_id) return null;

    const updatedCart = await Cart.findOneAndUpdate(
      {
        cart_userId: convertObjectToString(user_id),
      },
      {
        $set: { cart_products: [] },
      }
    );
    return updatedCart;
  }
}

module.exports = new CartServices();

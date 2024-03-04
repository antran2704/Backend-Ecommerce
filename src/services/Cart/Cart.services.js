const { Cart, CartItem } = require("../../models");
const convertObjectToString = require("../../helpers/convertObjectString");
const { getDateTime } = require("../../helpers/getDateTime");

class CartServices {
  async getCartByUserId(user_id) {
    if (!user_id) return null;

    const cart = await Cart.findOne({
      cart_userId: convertObjectToString(user_id),
    });
    return cart;
  }

  async getCartById(cart_id) {
    if (!cart_id) return null;

    const cart = await Cart.findById({
      _id: convertObjectToString(cart_id),
    });
    return cart;
  }

  async getItemsInCart(cart_id) {
    if (!cart_id) return null;

    const items = await CartItem.find({
      cart_id: convertObjectToString(cart_id),
    })
      .populate("product", {
        inventory: 1,
        title: 1,
        thumbnail: 1,
        price: 1,
        promotion_price: 1,
        slug: 1,
      })
      .populate("variation", {
        inventory: 1,
        title: 1,
        thumbnail: 1,
        price: 1,
        promotion_price: 1,
      });
    return items;
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

  // async checkProductInCart(user_id, product_id, variation_id) {
  //   if (!user_id || !product_id) return null;

  //   const productInCart = await Cart.findOne({
  //     cart_userId: convertObjectToString(user_id),
  //     cart_products: {
  //       $elemMatch: { $and: [{ product: product_id }, { variation: variation_id }] },
  //     },
  //   });

  //   return productInCart;
  // }

  async checkProductInCart(cart_id, product_id, variation_id) {
    if (!cart_id || !product_id) return null;

    const productInCart = await CartItem.findOne({
      cart_id: convertObjectToString(cart_id),
      product: product_id,
      variation: variation_id,
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

  // async updateItemsCart(user_id, payload) {
  //   if (!user_id) return null;
  //   const date = getDateTime();
  //   const { product_id, variation_id, quantity, price } = payload;

  //   // check shop is exit
  //   // const shopInCart = await this.checkShopInCart(user_id, shop_id);

  //   // case 1: chưa có shop và san pham tạo mới
  //   // if (!shopInCart) {
  //   //   console.log("case 1::: chưa có shop và san pham tạo mới");
  //   //   const updatedCart = await Cart.findOneAndUpdate(
  //   //     {
  //   //       cart_userId: convertObjectToString(user_id),
  //   //     },
  //   //     {
  //   //       $push: {
  //   //         cart_products: {
  //   //           shop_id,
  //   //           products: [{ product_id, variation, quantity, price }],
  //   //         },
  //   //       },
  //   //     }
  //   //   );

  //   //   return updatedCart;
  //   // }

  //   // case 2: đã có shop và có sản phẩm với id
  //   const productInCart = await this.checkProductInCart(
  //     user_id,
  //     product_id,
  //     variation_id
  //   );

  //   // case 3: đã có shop và chưa có sản phẩm với id
  //   if (!productInCart) {
  //     console.log("case 3::: chưa có sản phẩm với id");
  //     const updatedCart = await Cart.findOneAndUpdate(
  //       {
  //         cart_userId: convertObjectToString(user_id),
  //       },
  //       {
  //         $push: {
  //           cart_products: {
  //             product: product_id,
  //             variation: variation_id,
  //             quantity,
  //             price,
  //           },
  //         },
  //         $set: { updatedAt: date },
  //       },
  //       { new: true, upsert: true }
  //     )
  //       .populate("cart_products.product", {
  //         inventory: 1,
  //         title: 1,
  //         thumbnail: 1,
  //         price: 1,
  //         promotion_price: 1,
  //         slug: 1,
  //       })
  //       .populate("cart_products.variation", {
  //         inventory: 1,
  //         title: 1,
  //         thumbnail: 1,
  //         price: 1,
  //         promotion_price: 1,
  //       });

  //     return updatedCart;
  //   } else {
  //     console.log("case 2::: có sản phẩm với id");

  //     const updatedCart = await Cart.findOneAndUpdate(
  //       {
  //         cart_userId: convertObjectToString(user_id),
  //       },
  //       {
  //         $set: { "cart_products.$[i].quantity": quantity, updatedAt: date },
  //       },
  //       {
  //         arrayFilters: [
  //           {
  //             $and: [
  //               { "i.product": product_id },
  //               { "i.variation": variation_id },
  //             ],
  //           },
  //         ],
  //         new: true,
  //         upsert: true,
  //       }
  //     )
  //       .populate("cart_products.product", {
  //         inventory: 1,
  //         title: 1,
  //         thumbnail: 1,
  //         price: 1,
  //         promotion_price: 1,
  //         slug: 1,
  //       })
  //       .populate("cart_products.variation", {
  //         inventory: 1,
  //         title: 1,
  //         thumbnail: 1,
  //         price: 1,
  //         promotion_price: 1,
  //       });
  //     return updatedCart;
  //   }
  // }

  async updateItemsCart(user_id, cart_id, payload) {
    if (!user_id) return null;
    const date = getDateTime();
    const { product_id, variation_id, quantity, price } = payload;

    const updateItems = await CartItem.findOneAndUpdate(
      {
        cart_id: convertObjectToString(cart_id),
        product: product_id,
        variation: variation_id,
      },
      {
        $set: { quantity, price, updatedAt: date },
      },
      { new: true, upsert: true }
    );

    return updateItems;
  }

  async increaseItemsCart(user_id, cart_id, payload) {
    if (!user_id) return null;
    const date = getDateTime();
    const { product_id, variation_id, quantity, price } = payload;

    const updateItems = await CartItem.findOneAndUpdate(
      {
        cart_id: convertObjectToString(cart_id),
        product: product_id,
        variation: variation_id,
      },
      {
        $inc: { quantity },
        $set: { price, updatedAt: date },
      },
      { new: true, upsert: true }
    );

    return updateItems;
  }

  // async deleteItemCart(user_id, payload) {
  //   if (!user_id) return null;

  //   const { product_id, variation_id } = payload;

  //   if (!product_id) return null;

  //   const productInCart = await this.checkProductInCart(
  //     user_id,
  //     product_id,
  //     variation_id
  //   );

  //   if (!productInCart) return null;

  //   const date = getDateTime();
  //   const updatedCart = await Cart.findOneAndUpdate(
  //     {
  //       cart_userId: convertObjectToString(user_id),
  //     },
  //     {
  //       $pull: { cart_products: { product_id, variation_id } },
  //       $set: { updatedAt: date },
  //     },
  //     {
  //       new: true,
  //       upsert: true,
  //     }
  //   )
  //     .populate("product_id", {
  //       inventory: 1,
  //       title: 1,
  //       thumbnail: 1,
  //     })
  //     .populate("variation_id", {
  //       inventory: 1,
  //       title: 1,
  //       thumbnail: 1,
  //     });

  //   return updatedCart;
  // }

  async deleteItemCart(cart_id, payload) {
    if (!cart_id) return null;

    const { product_id, variation_id } = payload;

    if (!product_id) return null;

    const updatedCart = await CartItem.findOneAndDelete({
      cart_id: convertObjectToString(cart_id),
      product: product_id,
      variation: variation_id,
    });
    return updatedCart;
  }

  async deleteAllItemCart(cart_id) {
    if (!cart_id) return null;

    const updatedCart = await CartItem.deleteMany({
      cart_id: convertObjectToString(cart_id),
    });

    return updatedCart;
  }
}

module.exports = new CartServices();

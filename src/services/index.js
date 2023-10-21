const CategoriesServices = require("./Categories/categories.services");
const ProductServices = require("./Product/product.services");
const UserServices = require("./User/user.services");
const KeyTokenServices = require("./KeyToken/keyToken.services");
const CartServices = require("./Cart/Cart.services");
const InventoryServices = require("./Inventory/Inventory.services");
const DiscountServices = require("./Discount/Discount.services");
const OrderServices = require("./Order/Order.services");

module.exports = {
  CategoriesServices,
  ProductServices,
  UserServices,
  KeyTokenServices,
  CartServices,
  InventoryServices,
  DiscountServices,
  OrderServices
};

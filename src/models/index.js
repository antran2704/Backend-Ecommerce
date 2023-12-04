const Category = require("./Category/Category.model");
const User = require("./User/User.model");
const Product = require("./Product/Product.model");
const ProductItem = require("./Product/Product_item.model");
const Order = require("./Order/Order.model");
const Option = require("./Option/Option.model");
const KeyToken = require("./KeyToken/KeyToken.model");
const ApiKey = require("./ApiKey/ApiKey.model");
const Cart = require("./Cart/Cart.model");
const Inventory = require("./Inventory/Inventory.model");
const Discount = require("./Discount/Discount.model");
const Attribute = require("./Attribute/Attribute.model");

module.exports = {
  Category,
  User,
  Product,
  ProductItem,
  Order,
  Option,
  KeyToken,
  ApiKey,
  Cart,
  Inventory,
  Discount,
  Attribute
};

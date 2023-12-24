const Category = require("./Category/Category.model");
const User = require("./User/User.model"); 
const Admin = require("./Admin/Admin.model"); 
const Product = require("./Product/Product.model");
const ProductItem = require("./Product/Product_item.model");
const Order = require("./Order/Order.model");
const KeyToken = require("./KeyToken/KeyToken.model");
const ApiKey = require("./ApiKey/ApiKey.model");
const Cart = require("./Cart/Cart.model");
const Inventory = require("./Inventory/Inventory.model");
const Discount = require("./Discount/Discount.model");
const Attribute = require("./Attribute/Attribute.model");
const GrossDay = require("./GrossDay/GrossDay.model");

module.exports = {
  Category,
  User,
  Admin,
  Product,
  ProductItem,
  Order,
  KeyToken,
  ApiKey,
  Cart,
  Inventory,
  Discount,
  Attribute,
  GrossDay
};

const CategoriesServices = require("./Categories/categories.services");
const ProductServices = require("./Product/product.services");
const ProductItemServices = require("./Product/product_item.services");
const UserServices = require("./User/user.services");
const AdminServices = require("./Admin/Admin.services");
const KeyTokenServices = require("./KeyToken/keyToken.services");
const ApiKeyServices = require("./ApiKey/ApiKey.services");
const CartServices = require("./Cart/Cart.services");
const InventoryServices = require("./Inventory/Inventory.services");
const DiscountServices = require("./Discount/Discount.services");
const OrderServices = require("./Order/Order.services");
const OverviewServices = require("./Overview/Overview.services");
const AttributeServices = require("./Attribute/Attribute.services");

module.exports = {
  CategoriesServices,
  ProductServices,
  ProductItemServices,
  UserServices,
  AdminServices,
  KeyTokenServices,
  ApiKeyServices,
  CartServices,
  InventoryServices,
  DiscountServices,
  OrderServices,
  AttributeServices,
  OverviewServices
};

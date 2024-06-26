const CategoriesServices = require("./Categories/categories.services");
const ProductServices = require("./Product/product.services");
const ProductItemServices = require("./Product/product_item.services");
const UserServices = require("./User/user.services");
const AdminServices = require("./Admin/Admin.services");
const KeyTokenServices = require("./KeyToken/keyToken.services");
const ApiKeyServices = require("./ApiKey/ApiKey.services");
const CartServices = require("./Cart/Cart.services");
const InventoryServices = require("./Inventory/Inventory.services");
const PriceServices = require("./Price/Price.services");
const DiscountServices = require("./Discount/Discount.services");
const OrderServices = require("./Order/Order.services");
const OverviewServices = require("./Overview/Overview.services");
const AttributeServices = require("./Attribute/Attribute.services");
const BannerServices = require("./Banner/Banner.services");
const {
  GrossDateServices,
  GrossMonthServices,
  GrossYearServices,
} = require("./Gross");

const { NotificationAdminServices } = require("./Notification");

const { BlogServices, TagBlogServices } = require("./Blog");

// Cache Services
const CacheCategoriesServices = require("./Categories/cache.serices");
const CacheCartServices = require("./Cart/cache.services");
const CacheUserServices = require("./User/cache.services");
const CacheProductServices = require("./Product/cache.services");
const CacheBannerServices = require("./Banner/cache.serices");
const CachePriceServices = require("./Price/cache.services");
const CacheInventoryServices = require("./Inventory/cache.services");

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
  PriceServices,
  DiscountServices,
  OrderServices,
  AttributeServices,
  OverviewServices,
  GrossDateServices,
  GrossMonthServices,
  GrossYearServices,
  BannerServices,
  NotificationAdminServices,
  BlogServices,
  TagBlogServices,
  CacheCategoriesServices,
  CacheCartServices,
  CacheUserServices,
  CacheProductServices,
  CacheBannerServices,
  CachePriceServices,
  CacheInventoryServices
};

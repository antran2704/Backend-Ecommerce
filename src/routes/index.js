const express = require("express");
const path = require("path");

const AdminCategoryRoutes = require("./CategoryRoutes/admin");
const AdminProductRoutes = require("./ProductRoutes/admin");
const UserCategoryRoutes = require("./CategoryRoutes/user");
const UserProductRoutes = require("./ProductRoutes/user");
const ProductrItemRoutes = require("./ProductRoutes/product_item");
const OrderRoutes = require("./OrderRoutes");
const OverviewRoutes = require("./OverviewRoutes");
const UserRoutes = require("./UserRoutes");
const AdminRoutes = require("./AdminRoutes");
const DeleteRoutes = require("./DeleteRoutes");
const CartRoutes = require("./CartRoutes");
const VNPayRoutes = require("./PaymentRoutes/VNPayRoutes");
const DiscountRoutes = require("./DiscountRoutes");
const AttributeRoutes = require("./AttributeRoutes");
const GrossDateRoutes = require("./GrossRoutes/GrossDateRoutes");
const GrossMonthRoutes = require("./GrossRoutes/GrossMonthRoutes");
const GrossYearRoutes = require("./GrossRoutes/GrossYearRoutes");
const NotificationRoutes = require("./NotificationRoutes");
const BannerRoutes = require("./BannerRoutes");
const HtmlRoutes = require("./HtmlRoutes");

const routes = (app) => {
  app.use("/view", HtmlRoutes);
  app.use("/api/v1/carts", CartRoutes);
  app.use("/api/v1/discounts", DiscountRoutes);
  app.use("/api/v1/categories", UserCategoryRoutes);
  app.use("/api/v1/admin/categories", AdminCategoryRoutes);
  app.use("/api/v1/variations", ProductrItemRoutes);
  app.use("/api/v1/admin/products", AdminProductRoutes);
  app.use("/api/v1/products", UserProductRoutes);
  app.use("/api/v1/orders", OrderRoutes);
  app.use("/api/v1/overviews", OverviewRoutes);
  app.use("/api/v1/users", UserRoutes);
  app.use("/api/v1/payment/vnpay", VNPayRoutes);
  app.use("/api/v1/admin", AdminRoutes);
  app.use("/api/v1/attributes", AttributeRoutes);
  app.use("/api/v1/gross-date", GrossDateRoutes);
  app.use("/api/v1/gross-month", GrossMonthRoutes);
  app.use("/api/v1/gross-year", GrossYearRoutes);
  app.use("/api/v1/notification", NotificationRoutes);
  app.use("/api/v1/banners", BannerRoutes);
  app.use("/api/v1/delete", DeleteRoutes);
  app.use("/uploads", express.static("uploads"));
  app.use("/public", express.static(path.resolve(__dirname, "../assets")));
};
module.exports = routes;

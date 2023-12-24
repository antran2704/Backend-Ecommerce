const express = require("express");
const path = require("path");

const CategoryRoutes = require("./CategoryRoutes");
const ProductRoutes = require("./ProductRoutes");
const ProductrItemRoutes = require("./ProductRoutes/product_item");
const OrderRoutes = require("./OrderRoutes");
const OverviewRoutes = require("./OverviewRoutes");
const UserRoutes = require("./UserRoutes");
const AdminRoutes = require("./AdminRoutes");
const DeleteRoutes = require("./DeleteRoutes");
const CartRoutes = require("./CartRoutes");
const DiscountRoutes = require("./DiscountRoutes");
const AttributeRoutes = require("./AttributeRoutes");
const GrossDayRoutes = require("./GrossDayRoutes");
const HtmlRoutes = require("./HtmlRoutes");

const routes = (app) => {
  app.use("/view", HtmlRoutes);
  app.use("/api/v1/carts", CartRoutes);
  app.use("/api/v1/discounts", DiscountRoutes);
  app.use("/api/v1/categories", CategoryRoutes);
  app.use("/api/v1/variations", ProductrItemRoutes);
  app.use("/api/v1/products", ProductRoutes);
  app.use("/api/v1/orders", OrderRoutes);
  app.use("/api/v1/overviews", OverviewRoutes);
  app.use("/api/v1/users", UserRoutes);
  app.use("/api/v1/admin", AdminRoutes);
  app.use("/api/v1/attributes", AttributeRoutes);
  app.use("/api/v1/gross-day", GrossDayRoutes);
  app.use("/api/v1/delete", DeleteRoutes);
  app.use("/uploads", express.static("uploads"));
  app.use("/public", express.static(path.resolve(__dirname, "../assets")));
};
module.exports = routes;

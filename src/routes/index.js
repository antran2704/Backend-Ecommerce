const express = require("express");
const path = require("path");

const CategoryRoutes = require("./CategoryRoutes");
const ProductRoutes = require("./ProductRoutes");
const ProductrItemRoutes = require("./ProductRoutes/product_item");
const OrderRoutes = require("./OrderRoutes");
const UserRoutes = require("./UserRoutes");
const DeleteRoutes = require("./DeleteRoutes");
const CartRoutes = require("./CartRoutes");
const DiscountRoutes = require("./DiscountRoutes");
const VariantRoutes = require("./VariantRoutes");
const HtmlRoutes = require("./HtmlRoutes");

const routes = (app) => {
  app.use("/view", HtmlRoutes);
  app.use("/api/v1/carts", CartRoutes);
  app.use("/api/v1/discounts", DiscountRoutes);
  app.use("/api/v1/categories", CategoryRoutes);
  app.use("/api/v1/variations", ProductrItemRoutes);
  app.use("/api/v1/products", ProductRoutes);
  app.use("/api/v1/orders", OrderRoutes);
  app.use("/api/v1/users", UserRoutes);
  app.use("/api/v1/variants", VariantRoutes);
  app.use("/api/v1/delete", DeleteRoutes);
  app.use("/uploads", express.static("uploads"));
  app.use("/public", express.static(path.resolve(__dirname, "../assets")));
};
module.exports = routes;

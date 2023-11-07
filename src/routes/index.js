const express = require("express");
const path = require("path");

const CategoryRoutes = require("./CategoryRoutes");
const ProductRoutes = require("./ProductRoutes");
const OrderRoutes = require("./OrderRoutes");
const UserRoutes = require("./UserRoutes");
const OptionRoutes = require("./OptionRoutes");
const DeleteRoutes = require("./DeleteRoutes");
const CartRoutes = require("./CartRoutes");
const DiscountRoutes = require("./DiscountRoutes");
const VariantRoutes = require("./VariantRoutes");
const HtmlRoutes = require("./HtmlRoutes");

const routes = (app) => {
  app.use("/view", HtmlRoutes);
  app.use("/api/v1/cart", CartRoutes);
  app.use("/api/v1/discount", DiscountRoutes);
  app.use("/api/v1/categories", CategoryRoutes);
  app.use("/api/v1/products", ProductRoutes);
  app.use("/api/v1/order", OrderRoutes);
  app.use("/api/v1/user", UserRoutes);
  app.use("/api/v1/option", OptionRoutes);
  app.use("/api/v1/variants", VariantRoutes);
  app.use("/api/v1/delete", DeleteRoutes);
  app.use("/uploads", express.static("uploads"));
  app.use("/public", express.static(path.resolve(__dirname, "../assets")));
};
module.exports = routes;

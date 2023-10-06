const express = require("express");
const path = require("path");

const CategoryRoutes = require("./CategoryRoutes/index");
const ProductRoutes = require("./ProductRoutes/index");
const OrderRoutes = require("./OrderRoutes/index");
const UserRoutes = require("./UserRoutes/index");
const OptionRoutes = require("./OptionRoutes/index");
const DeleteRoutes = require("./DeleteRoutes/index");
const HtmlRoutes = require("./HtmlRoutes/index");

const routes = (app) => {
  app.use("/view", HtmlRoutes);
  app.use("/api/v1/category", CategoryRoutes);
  app.use("/api/v1/product", ProductRoutes);
  app.use("/api/v1/order", OrderRoutes);
  app.use("/api/v1/user", UserRoutes);
  app.use("/api/v1/option", OptionRoutes);
  app.use("/api/v1/delete", DeleteRoutes);
  app.use("/uploads", express.static("uploads"));
  app.use("/public", express.static(path.resolve(__dirname, "../assets")));
};
module.exports = routes;

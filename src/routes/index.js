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
  app.use("/api/category", CategoryRoutes);
  app.use("/api/product", ProductRoutes);
  app.use("/api/order", OrderRoutes);
  app.use("/api/user", UserRoutes);
  app.use("/api/option", OptionRoutes);
  app.use("/api/delete", DeleteRoutes);
  app.use("/uploads", express.static("uploads"));
  app.use("/public", express.static(path.resolve(__dirname, "../assets")));
};
module.exports = routes;

const express = require("express");

const CategoryRoutes = require("./CategoryRoutes/index");
const ProductRoutes = require("./ProductRoutes/index");
const OrderRoutes = require("./OrderRoutes/index");
const UserRoutes = require("./UserRoutes/index");
const DeleteRoutes = require("./DeleteRoutes/index");

const routes = (app) => {
  app.use("/api/category", CategoryRoutes);
  app.use("/api/product", ProductRoutes);
  app.use("/api/order", OrderRoutes);
  app.use("/api/user", UserRoutes);
  app.use("/api/delete", DeleteRoutes);
  app.use("/uploads", express.static("uploads"));
};

module.exports = routes;

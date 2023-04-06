const CategoryRoutes = require("./CategoryRoutes/index");
const ProductRoutes = require("./ProductRoutes/index");
const OrderRoutes = require("./OrderRoutes/index");

const routes = (app) => {
  app.use("/api/category", CategoryRoutes);
  app.use("/api/product", ProductRoutes);
  app.use("/api/order", OrderRoutes);
};

module.exports = routes;

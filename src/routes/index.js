const CategoryRoutes = require("./CategoryRoutes/index");
const ProductRoutes = require("./ProductRoutes/index");

const routes = (app) => {
  app.use("/api/category", CategoryRoutes);
  app.use("/api/product", ProductRoutes);
};

module.exports = routes;

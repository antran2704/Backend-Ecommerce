const CategoryRoutes = require("./CategoryRoutes/index");

const routes = (app) => {
  app.use("/api/category", CategoryRoutes);
};

module.exports = routes;

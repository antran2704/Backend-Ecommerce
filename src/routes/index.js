const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../routes");
const swaggerJSDoc = require("swagger-jsdoc");

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
const NotificationAdminRoutes = require("./NotificationRoutes/admin");
const BannerRoutes = require("./BannerRoutes");
const AdminBlogRoutes = require("./BlogRoutes/admin");
const UserBlogRoutes = require("./BlogRoutes/user");
const TagBlogAdminRoutes = require("./TagBlogRoutes/admin");
const HtmlRoutes = require("./HtmlRoutes");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API for Shop Antran",
    version: "1.0.0",
    description: "This is document for api shop Antran. Please check it",
  },
  servers: [
    {
      url: "http://localhost:3001/api/v1",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [__dirname + "/ProductRoutes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const routes = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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
  app.use("/api/v1/blogs", UserBlogRoutes);
  app.use("/api/v1/admin/blogs-tag", TagBlogAdminRoutes);
  app.use("/api/v1/admin/blogs", AdminBlogRoutes);
  app.use("/api/v1/admin", AdminRoutes);
  app.use("/api/v1/attributes", AttributeRoutes);
  app.use("/api/v1/gross-date", GrossDateRoutes);
  app.use("/api/v1/gross-month", GrossMonthRoutes);
  app.use("/api/v1/gross-year", GrossYearRoutes);
  app.use("/api/v1/notifications/admin", NotificationAdminRoutes);
  app.use("/api/v1/banners", BannerRoutes);
  app.use("/api/v1/delete", DeleteRoutes);
  app.use("/uploads", express.static("uploads"));
  app.use("/public", express.static(path.resolve(__dirname, "../assets")));

  // middleware when not found route
  app.use((req, res, next) => {
    const error = new Error("Not found route");
    error.status = 404;

    next(error);
  });

  app.use((error, req, res, next) => {
    const statusCode = error.status || 500;

    return res
      .status(statusCode)
      .json({ status: statusCode, message: error.message });
  });
};
module.exports = routes;

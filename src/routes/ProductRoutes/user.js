const express = require("express");
const router = express.Router();

const ProductController = require("../../controller/ProductController/user");

// [GET] ALL PRODUCT
router.get(
  "/category/:id",
  ProductController.getProductsInCategory
);

// [SEARCH] A PRODUCT
router.get("/search", ProductController.searchProduct);

// [GET] A PRODUCT WITH ID
router.get("/id/:id", ProductController.getProductById);

// [GET] A PRODUCT WITH ID
router.get("/other", ProductController.getOtherProducts);

// [GET] A PRODUCT
router.get("/:slug", ProductController.getProduct);

// [GET] ALL PRODUCTS
router.get("/", ProductController.getProducts);

module.exports = router;

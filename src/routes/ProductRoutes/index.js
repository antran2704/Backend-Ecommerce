const express = require("express");
const router = express.Router();
const ProductController = require("../../controller/ProductController");

// [GET] ALL PRODUCTS
router.get("/getAllProducts", ProductController.getAllProduct);

// [GET] A PRODUCT
router.get("/:slug", ProductController.getAProduct);

// [POST] A PRODUCT
router.post("/", ProductController.addProduct);

// [PATCH] A PRODUCT
router.patch("/:id", ProductController.changeProduct)

// [DELETE] A PRODUCT
router.delete("/:id", ProductController.deleteProduct)

module.exports = router;
const express = require("express");
const util = require("util");
const router = express.Router();
const multer = require("../../middlewares/Multer");

const ProductController = require("../../controller/ProductController");

// [GET] ALL PRODUCTS
router.get("/getAllProducts", ProductController.getAllProduct);

// [GET] ALL PRODUCTS
router.get("/getCategories", ProductController.getCategories);

// [GET] ALL PRODUCTS
router.get(
  "/getAllProductsInCategory/:id",
  ProductController.getAllProductInCategory
);

// [SEARCH] A PRODUCT
router.get("/search", ProductController.searchProduct);

// [GET] A PRODUCT
router.get("/:slug", ProductController.getAProduct);

// UPLOAD THUMBNAIL
router.post(
  "/uploadThumbnail",
  util.promisify(multer.upload("./uploads/product").single("thumbnail")),
  ProductController.uploadThumbnail
);

// UPLOAD GALLERY
router.post(
  "/uploadGallery",
  util.promisify(multer.upload("./uploads/product").array("gallery", 6)),
  ProductController.uploadGallery
);

// [POST] A PRODUCT
router.post("/", ProductController.addProduct);

// [PATCH] A PRODUCT
router.patch("/:id", ProductController.changeProduct);

// [DELETE] A PRODUCT
router.delete("/:id", ProductController.deleteProduct);

module.exports = router;

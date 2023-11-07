const express = require("express");
const router = express.Router();
const multer = require("../../middlewares/Multer");

const ProductController = require("../../controller/ProductController");

// [GET] ALL PRODUCTS
router.get("/getProducts", ProductController.getProducts);

// [GET] ALL PRODUCT
router.get(
  "/getProductsInCategory/:id",
  ProductController.getProductsInCategory
);

// [SEARCH] A PRODUCT
router.get("/search", ProductController.searchProduct);

// [GET] A PRODUCT WITH ID
router.get("/id/:id", ProductController.getProductById);

// [GET] A PRODUCT
router.get("/:slug", ProductController.getProduct);

// UPLOAD THUMBNAIL
router.post(
  "/uploadThumbnail",
  multer.upload("./uploads/product").single("thumbnail"),
  ProductController.uploadThumbnail
);

// UPLOAD GALLERY
router.post(
  "/uploadGallery",
  multer.upload("./uploads/product").array("gallery", 6),
  ProductController.uploadGallery
);

// [POST] A PRODUCT
router.post("/", ProductController.createProduct);

// [PATCH] UPDATE PRODUCT
router.patch("/:id", ProductController.updateProduct);

// [DELETE] A PRODUCT
router.post("/:id", ProductController.deleteProduct);

module.exports = router;

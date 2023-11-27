const express = require("express");
const router = express.Router();
const multer = require("../../middlewares/Multer");

const ProductController = require("../../controller/ProductController");

// [GET] ALL PRODUCT
router.get(
  "/category/:id",
  ProductController.getProductsInCategory
);

// [SEARCH] A PRODUCT
router.get("/search", ProductController.searchProduct);

// [GET] A PRODUCT WITH ID
router.get("/id/:id", ProductController.getProductById);

// [GET] A PRODUCT
router.get("/:slug", ProductController.getProduct);

// UPLOAD Image
router.post(
  "/uploadImage",
  multer.upload("./uploads/product").single("image"),
  ProductController.uploadThumbnail
);

// UPLOAD GALLERY
router.post(
  "/uploadImages",
  multer.upload("./uploads/product").array("images", 6),
  ProductController.uploadGallery
);

// [PATCH] UPDATE PRODUCT
router.patch("/:id", ProductController.updateProduct);

// [DELETE] A PRODUCT
router.delete("/:id", ProductController.deleteProduct);

// [GET] ALL PRODUCTS
router.get("/", ProductController.getProducts);

// [POST] A PRODUCT
router.post("/", ProductController.createProduct);

module.exports = router;

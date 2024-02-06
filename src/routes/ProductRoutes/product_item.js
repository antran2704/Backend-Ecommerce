const express = require("express");
const router = express.Router();
const multer = require("../../middlewares/Multer");

const ProductItemController = require("../../controller/ProductController/product_item");

// UPLOAD IMAGE
router.post(
  "/upload/image",
  multer.upload("./uploads/product_item").single("product_image"),
  ProductItemController.uploadImage
);

// [PATCH] UPDATE PRODUCT ITEM
router.patch("/:id", ProductItemController.updateProductItem);

// [DELETE] A PRODUCT ITEM
router.delete("/:id", ProductItemController.deleteProductItem);

// [GET] A PRODUCT ITEM WITH ID
router.get("/item/:id", ProductItemController.getProductItem);

// [GET] ALL PRODUCT ITEMS
router.get("/all/:product_id", ProductItemController.getProductItems);

// [POST] CREATE PRODUCT ITEM
router.post("/", ProductItemController.createProductItems);

// [GET] ALL PRODUCT ITEMS
router.get("/:product_id", ProductItemController.getProductItemsWithPage);

module.exports = router;

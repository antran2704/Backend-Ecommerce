const express = require("express");
const router = express.Router();
const multer = require("../../middlewares/Multer");

const ProductItemController = require("../../controller/ProductController/product_item");
const { ImageMiddleware } = require("../../middlewares/Image");

// UPLOAD IMAGE
router.post(
  "/upload/image",
  multer.upload("./uploads/product_item").single("product_image"),
  ImageMiddleware.checkPathImage,
  ProductItemController.uploadImage
);


// [PATCH] UPDATE PRODUCT ITEMS
router.patch("/items", ProductItemController.updateProductItems);

// [PATCH] UPDATE PRODUCT ITEM
router.patch("/:product_id", ProductItemController.updateProductItem);

// [DELETE] A PRODUCT ITEM
router.delete("/:id", ProductItemController.deleteProductItem);

// [GET] A PRODUCT ITEM WITH ID
router.get("/item/:id", ProductItemController.getProductItem);

// [GET] ALL PRODUCT ITEMS
router.get("/all/:product_id", ProductItemController.getProductItems);

// [POST] CREATE PRODUCT ITEM
router.post("/:product_id", ProductItemController.createProductItems);

// [GET] ALL PRODUCT ITEMS
router.get("/:product_id", ProductItemController.getProductItemsWithPage);

module.exports = router;

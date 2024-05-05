const express = require("express");
const router = express.Router();
const DiscountController = require("../../controller/DiscountController");
const AuthenMiddleware = require("../../middlewares/Auth");
const multer = require("../../middlewares/Multer");
const DiscountMiddleware = require("../../middlewares/Discount");
const { ImageMiddleware } = require("../../middlewares/Image");

router.use(AuthenMiddleware.authentication);
router.use(AuthenMiddleware.authorization("0000"));

router.get("/search", DiscountController.searchDiscounts);

router.patch("/:id", DiscountController.updateDiscount);

router.delete("/:discount_id", DiscountController.deleteDiscount);

// UPLOAD THUMBNAIL
router.post(
  "/uploadThumbnail",
  multer.upload("./uploads/discount").single("thumbnail"),
  ImageMiddleware.checkPathImage,
  DiscountController.uploadThumbnail
);

// [POST] GET DISCOUNT ON CLIENT BY CODE ID
router.post(
  "/client",
  DiscountMiddleware.checkDiscount,
  DiscountController.getDiscount
);

// [POST] USE DISCOUNT
router.post(
  "/use",
  DiscountMiddleware.checkDiscount,
  DiscountController.useDiscount
);

// [POST] CREATE DISCOUNT
router.post("/", DiscountController.createDiscount);

// [GET] GET DISCOUNT BY CODE ID
router.get("/id/:discount_id", DiscountController.getDiscountById);

// [GET] GET DISCOUNT BY CODE ID
router.get("/:discount_code", DiscountController.getDiscount);

// [GET] GET DISCOUNTs
router.get("/", DiscountController.getDiscounts);

module.exports = router;

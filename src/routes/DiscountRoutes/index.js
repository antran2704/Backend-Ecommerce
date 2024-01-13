const express = require("express");
const router = express.Router();
const DiscountController = require("../../controller/DiscountController");
const UserMiddleware = require("../../middlewares/Auth");
const multer = require("../../middlewares/Multer");
const DiscountMiddleware = require("../../middlewares/Discount");

router.use(UserMiddleware.authentication);
router.use(UserMiddleware.authorization("0000"));

router.get("/search", DiscountController.searchDiscounts);

router.patch("/:id", DiscountController.updateDiscount);

router.delete("/:discount_id", DiscountController.deleteDiscount);

// UPLOAD THUMBNAIL
router.post(
  "/uploadThumbnail",
  multer.upload("./uploads/discount").single("thumbnail"),
  DiscountController.uploadThumbnail
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

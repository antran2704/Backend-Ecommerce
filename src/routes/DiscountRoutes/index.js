const express = require("express");
const router = express.Router();
const DiscountController = require("../../controller/DiscountController");

// [PATCH] UPDATE DISCOUNT
router.patch("/:discount_code", DiscountController.updateDiscount);

// [POST] CREATE DISCOUNT
router.post("/", DiscountController.createDiscount);

// [GET] GET DISCOUNT BY CODE ID
router.get("/:discount_code", DiscountController.getDiscount);

// [GET] GET DISCOUNTs
router.get("/", DiscountController.getDiscounts);

module.exports = router;
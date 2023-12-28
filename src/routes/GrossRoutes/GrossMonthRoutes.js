const express = require("express");
const router = express.Router();
const { GrossMonthController } = require("../../controller/GrossController");

// [GET] GROSS WITH ID
router.get("/id/:gross_id", GrossMonthController.getGrossById);

// [PATCH] UPDATE GROSS
router.patch("/update/order", GrossMonthController.updateOrderGross);

// [PATCH] UPDATE GROSS
router.patch("/update/cancle", GrossMonthController.updateCancleOrder);

// [PATCH] UPDATE GROSS
router.patch("/update/total", GrossMonthController.updateTotalGross);

// [POST] CREATE GROSS
router.post("/", GrossMonthController.createGross);

// [GET] GROSS MONTH IN 1 YEAR
router.get("/year", GrossMonthController.getGrossByYear);

// [GET] GROSS BY MONTH & YEAR
router.get("/", GrossMonthController.getGrossByMonth);

module.exports = router;

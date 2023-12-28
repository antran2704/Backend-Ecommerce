const express = require("express");
const router = express.Router();
const { GrossYearController } = require("../../controller/GrossController");

// [PATCH] UPDATE GROSS
router.patch("/update/order", GrossYearController.updateOrderGross);

// [PATCH] UPDATE GROSS
router.patch("/update/cancle", GrossYearController.updateCancleOrder);

// [PATCH] UPDATE GROSS
router.patch("/update/total", GrossYearController.updateTotalGross);

// [POST] CREATE GROSS
router.post("/", GrossYearController.createGross);

// [GET] GROSS
router.get("/year", GrossYearController.getGrossByYear);

// [GET] GROSS
router.get("/", GrossYearController.getGross);

module.exports = router;

const express = require("express");
const router = express.Router();
const GrossDayController = require("../../controller/GrossDayController");

// [GET] GROSS WITH ID
router.get("/id/:gross_id", GrossDayController.getGrossWithId);

// [GET] GROSS IN DAY
router.get("/date", GrossDayController.getGrossInDay);

// [PATCH] UPDATE GROSS
router.patch("/update/order", GrossDayController.updateOrderGross);

// [PATCH] UPDATE GROSS
router.patch("/update/total", GrossDayController.updateTotalGross);

// [POST] CREATE GROSS
router.post("/", GrossDayController.createGross);

// [GET] GROSS
router.get("/", GrossDayController.getGross);

module.exports = router;

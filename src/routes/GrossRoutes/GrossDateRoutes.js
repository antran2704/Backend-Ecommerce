const express = require("express");
const router = express.Router();
const { GrossDateController } = require("../../controller/GrossController");

// [GET] GROSS WITH ID
router.get("/id/:gross_id", GrossDateController.getGrossById);

// [GET] GROSS IN HOME
router.get("/home", GrossDateController.getGrossInHome);

// [GET] GROSS IN MONTH
router.get("/month", GrossDateController.getGrossInMonth);

// [GET] GROSS IN WEEK
router.get("/week", GrossDateController.getGrossInWeek);

// [PATCH] UPDATE GROSS
router.patch("/update/order", GrossDateController.updateOrderGross);

// [PATCH] UPDATE GROSS
router.patch("/update/total", GrossDateController.updateTotalGross);

// [POST] CREATE GROSS
router.post("/", GrossDateController.createGross);

// [GET] GROSS IN DAY
router.get("/", GrossDateController.getGrossInDay);

module.exports = router;

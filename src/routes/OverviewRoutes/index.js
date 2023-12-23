const express = require("express");
const router = express.Router();
const OverviewController = require("../../controller/OverviewController");

// [GET] ODERS WITH STATUS
router.get("/status/:status", OverviewController.getOrdersWithStatus);


// [GET] TOTAL ODERS TODAY
router.get("/orders_today", OverviewController.getOrdersToday);

// [GET] OVERVIEWS IN HOME
router.get("/home", OverviewController.getOverviewsInHome);
module.exports = router;
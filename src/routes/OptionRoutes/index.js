const express = require("express");
const router = express.Router();
const OptionController = require("../../controller/OptionController");

// [GET] ALL PRODUCTS
router.get("/getAllOptions", OptionController.getAllOptions);

// [GET] AN OPTION
router.get("/:id", OptionController.getAnOption);

module.exports = router;
const express = require("express");
const router = express.Router();
const CategoryController = require("../../controller/CategoryController");

// [GET] all categories
router.get("/", CategoryController.getAllCategory);
// [POST] a Category
router.post("/", CategoryController.addCategory);

module.exports = router;
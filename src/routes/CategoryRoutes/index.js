const express = require("express");
const router = express.Router();
const CategoryController = require("../../controller/CategoryController");

// [GET] ALL CATEGORIES
router.get("/", CategoryController.getAllCategories);

// [GET] A CATEGORIES
router.get("/:id", CategoryController.getACategory);

// [POST] A CATEGORY
router.post("/", CategoryController.addCategory);

// [PATCH] A CATEGORY
router.patch("/:id", CategoryController.changeCategory)

// [DELETE] A CATEGORY
router.delete("/:id", CategoryController.deleteCategory)

module.exports = router;
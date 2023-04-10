const express = require("express");
const router = express.Router();
const CategoryController = require("../../controller/CategoryController");

// [GET] ALL CATEGORIES
router.get("/getAllCategories", CategoryController.getAllCategories);

// [GET] A CATEGORIES
router.get("/:slug", CategoryController.getACategory);

// [POST] A CATEGORY
router.post("/", CategoryController.addCategory);

router.post("/test", CategoryController.test);

// [PATCH] A CATEGORY
router.patch("/:id", CategoryController.changeCategory)

// [DELETE] A CATEGORY
router.delete("/:id", CategoryController.deleteCategory)

module.exports = router;
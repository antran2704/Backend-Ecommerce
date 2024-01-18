const express = require("express");
const router = express.Router();

const CategoryController = require("../../controller/Categories/user");

// [GET] ALL CATEGORIES
router.get("/all", CategoryController.getCategoriesAll);

// [GET] PARENT CATEGORIES
router.get("/parent", CategoryController.getParentCategories);

// [SEARCH] CATEGORIES
router.get("/search", CategoryController.searchCategories);

// [GET] A CATEGORIES BY ID
router.get("/id/:id", CategoryController.getCategoryById);

// [GET] A CATEGORIES
router.get("/:slug", CategoryController.getCategory);

// [GET] ALL CATEGORIES WITH PAGE
router.get("/", CategoryController.getCategories);

module.exports = router;

const express = require("express");
const router = express.Router();

const multer = require("../../middlewares/Multer");
const CategoryController = require("../../controller/CategoryController");

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

// UPLOAD THUMBNAIL
router.post(
  "/uploadThumbnail",
  multer.upload("./uploads/category").single("thumbnail"),
  CategoryController.uploadThumbnail
);

// [PATCH] A CATEGORY
router.patch("/:id", CategoryController.updateCategory);

// [DELETE] A CATEGORY
router.delete("/:id", CategoryController.deleteCategory);

// [GET] ALL CATEGORIES WITH PAGE
router.get("/", CategoryController.getCategories);

// [POST] A CATEGORY
router.post("/", CategoryController.createCategory);

module.exports = router;

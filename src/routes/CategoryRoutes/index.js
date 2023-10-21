const express = require("express");
const router = express.Router();

const multer = require("../../middlewares/Multer");
const CategoryController = require("../../controller/CategoryController");

// [GET] ALL CATEGORIES
router.get("/getCategories", CategoryController.getCategories);

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
router.post("/:id", CategoryController.deleteCategory);

// [POST] A CATEGORY
router.post("/", CategoryController.createCategory);

module.exports = router;
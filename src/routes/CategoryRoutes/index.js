const express = require("express");
const router = express.Router();

const multer = require("../../middlewares/Multer");
const CategoryController = require("../../controller/CategoryController");

// [GET] ALL CATEGORIES
router.get("/getAllCategories", CategoryController.getAllCategories);

// [SEARCH] CATEGORIES
router.get("/search", CategoryController.searchCategories);

// [GET] A CATEGORIES
router.get("/:slug", CategoryController.getACategory);

// [POST] A CATEGORY
router.post("/", CategoryController.addCategory);

// UPLOAD THUMBNAIL
router.post(
  "/uploadThumbnail",
  multer.upload("./uploads/category").single("thumbnail"),
  CategoryController.uploadThumbnail
);

router.post("/test", CategoryController.test);

// [PATCH] A CATEGORY
router.patch("/:id", CategoryController.changeCategory);

// [DELETE] A CATEGORY
router.delete("/:id", CategoryController.deleteCategory);

module.exports = router;
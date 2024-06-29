const express = require("express");
const router = express.Router();

const multer = require("../../middlewares/Multer");
const { AdminBlogController } = require("../../controller/BlogController");
const { ImageMiddleware } = require("../../middlewares/Image");
const AuthenMiddleware = require("../../middlewares/Auth");
const { PERMISION } = require("../../common");

// UPLOAD THUMBNAIL
router.post(
  "/uploadImage",
  multer.upload("./uploads/tag_blog").single("image"),
  ImageMiddleware.checkPathImage,
  AdminBlogController.uploadImage
);

// [PATCH] A TAG BLOG
router.patch("/:id", AdminBlogController.updateTag);

// [DELETE] A TAG BLOG
router.delete(
  "/:id",
  // AuthenMiddleware.authentication,
  // AuthenMiddleware.authorization(PERMISION.ADMIN),
  AdminBlogController.deleteTag
);

// [GET] SEARCH TAG BLOGS WITH PAGE
router.get("/search", AdminBlogController.searchTag);

// [GET] A TAG BLOG BY ID
router.get("/:id", AdminBlogController.getTagById);

// [GET] ALL TAG BLOGS WITH PAGE
router.get("/", AdminBlogController.getTagsWithPage);

// [POST] CREATE A TAG BLOG
router.post("/", AdminBlogController.createTag);

module.exports = router;

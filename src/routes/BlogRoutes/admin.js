const express = require("express");
const router = express.Router();

const multer = require("../../middlewares/Multer");
const { AdminBlogController } = require("../../controller/BlogController");
const { ImageMiddleware } = require("../../middlewares/Image");
const AuthenMiddleware = require("../../middlewares/Auth");
const { PERMISION } = require("../../middlewares/Auth/data");

// UPLOAD THUMBNAIL
router.post(
  "/uploadImage",
  multer.upload("./uploads/blog").single("image"),
  ImageMiddleware.checkPathImage,
  AdminBlogController.uploadImage
);

// [PATCH] A BLOG
router.patch("/:id", AdminBlogController.updateBlog);

// [DELETE] A BLOG
router.delete(
  "/:id",
  // AuthenMiddleware.authentication,
  // AuthenMiddleware.authorization(PERMISION.ADMIN),
  AdminBlogController.deleteBlog
);

// [GET] SEARCH BLOGS WITH PAGE
router.get("/search", AdminBlogController.searchBlog);

// [GET] A BLOG BY ID
router.get("/id/:id", AdminBlogController.getBlogById);

// [GET] A BLOG BY SLUG
router.get("/:slug", AdminBlogController.getBlog);

// [GET] ALL BLOGS WITH PAGE
router.get("/", AdminBlogController.getBlogsWithPage);

// [POST] CREATE A BLOG
router.post("/", AdminBlogController.createBlog);

module.exports = router;

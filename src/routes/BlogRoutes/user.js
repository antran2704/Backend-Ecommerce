const express = require("express");
const router = express.Router();

const { UserBlogController } = require("../../controller/BlogController");
const AuthenMiddleware = require("../../middlewares/Auth");
const { PERMISION } = require("../../middlewares/Auth/data");

// [GET] SEARCH BLOGS WITH PAGE
router.get("/search", UserBlogController.searchBlog);

// [GET] A BLOG BY SLUG
router.get("/:slug", UserBlogController.getBlog);

// [GET] ALL BLOGS WITH PAGE
router.get("/", UserBlogController.getBlogsWithPage);

module.exports = router;

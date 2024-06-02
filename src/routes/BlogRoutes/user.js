const express = require("express");
const router = express.Router();

const { UserBlogController } = require("../../controller/BlogController");

// [GET] SEARCH BLOGS WITH PAGE
router.get("/search", UserBlogController.searchBlog);

// [GET] SEARCH BLOGS WITH PAGE
router.get("/other/:blogId", UserBlogController.getOtherBlogs);

// [GET] A BLOG BY SLUG
router.get("/:slug", UserBlogController.getBlog);

// [GET] ALL BLOGS WITH PAGE
router.get("/", UserBlogController.getBlogsWithPage);

module.exports = router;

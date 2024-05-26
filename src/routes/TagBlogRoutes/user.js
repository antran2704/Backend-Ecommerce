const express = require("express");
const router = express.Router();

const { UserBlogController } = require("../../controller/BlogController");

// [GET] SEARCH TAG BLOGS WITH PAGE
router.get("/search", UserBlogController.searchTag);

// [GET] A TAG BLOG BY ID
router.get("/:slug", UserBlogController.getTag);

// [GET] ALL TAG BLOGS WITH PAGE
router.get("/", UserBlogController.getTagsWithPage);

module.exports = router;

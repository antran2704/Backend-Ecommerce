const express = require("express");
const router = express.Router();

const multer = require("../../middlewares/Multer");
const BannerController = require("../../controller/BannerController");
const { ImageMiddleware } = require("../../middlewares/Image");
const AuthenMiddleware = require("../../middlewares/Auth");
const { PERMISION } = require("../../common");

// [GET] ALL CATEGORIES
router.get("/admin", BannerController.getBannersWithPage);

// UPLOAD THUMBNAIL
router.post(
  "/uploadImage",
  multer.upload("./uploads/banner").single("image"),
  ImageMiddleware.checkPathImage,
  BannerController.uploadImage
);

// [PATCH] A CATEGORY
router.patch("/:id", BannerController.updateBanner);

// [DELETE] A CATEGORY
router.delete(
  "/:id",
  AuthenMiddleware.authentication,
  AuthenMiddleware.authorization(PERMISION.ADMIN),
  BannerController.deleteBanner
);

// [GET] A CATEGORIES BY ID
router.get("/:id", BannerController.getBanner);

// [GET] ALL CATEGORIES WITH PAGE
router.get("/", BannerController.getBannersWithPageInClient);

// [POST] A CATEGORY
router.post("/", BannerController.createBanner);

module.exports = router;

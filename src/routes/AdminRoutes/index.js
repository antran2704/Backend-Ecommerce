const express = require("express");
const router = express.Router();
const multer = require("../../middlewares/Multer");

const AdminController = require("../../controller/AdminController");
const UserMiddleware = require("../../middlewares/Auth");
const { ImageMiddleware } = require("../../middlewares/Image");

// [GET] ALL USERS
router.get(
  "/getUsers",
  UserMiddleware.authentication,
  AdminController.getUsers
);

// [POST] LOGIN
router.post(
  "/login",
  UserMiddleware.checkValidEmail,
  UserMiddleware.checkValidPassword,
  AdminController.login
);

// [POST] REFRESH TOKEN
router.post(
  "/forget-password/send-email",
  UserMiddleware.checkValidEmail,
  AdminController.sendEmailForgetPassword
);

// [POST] REFRESH TOKEN
router.post(
  "/forget-password/check-key",
  UserMiddleware.checkValidEmail,
  AdminController.checkForgetKey
);

// [POST] REFRESH TOKEN
router.post(
  "/forget-password",
  UserMiddleware.checkValidEmail,
  UserMiddleware.checkValidPassword,
  AdminController.forgetPassword
);

// [POST] REFRESH TOKEN
router.get("/refreshToken", AdminController.refreshToken);

// [GET] CHECK CHANGE PASSWORD KEY
router.post("/changePassword", AdminController.changePassword);

// [POST] BAN USER
router.post("/ban", AdminController.banUser);

// [POST] UNBAN USER
router.post("/unban", AdminController.unbanUser);

// [POST] CONFIRM EMAIL AND ADD USER
router.post("/", AdminController.creatUser);

// [POST] UPDATE USER
router.patch("/:id", AdminController.updateUser);

// UPLOAD Avartar
router.post(
  "/avartar",
  multer.upload("./uploads/user").single("image"),
  ImageMiddleware.checkPathImage,
  AdminController.uploadAvartar
);

// [GET] USER
router.get("/", UserMiddleware.authentication, AdminController.getUser);

module.exports = router;

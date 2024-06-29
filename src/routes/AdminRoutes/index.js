const express = require("express");
const router = express.Router();
const multer = require("../../middlewares/Multer");

const AdminController = require("../../controller/AdminController");
const AuthenMiddleware = require("../../middlewares/Auth");
const ValidInputMiddleware = require("../../middlewares/ValidInput");
const { ImageMiddleware } = require("../../middlewares/Image");
const { ROLE, PERMISION } = require("../../common");

// [GET] ALL USERS
router.get(
  "/getUsers",
  AuthenMiddleware.authentication,
  AdminController.getUsers
);

// [POST] REFRESH TOKEN
router.get("/refreshToken", AdminController.refreshToken);

// [GET] PERMISION
router.get(
  "/:user_id",
  AuthenMiddleware.authentication,
  AuthenMiddleware.authorization(
    [ROLE.ADMIN, ROLE.STAFF],
    [PERMISION.ADMIN, PERMISION.STAFF]
  ),
  AdminController.getPermission
);

// [POST] LOGIN
router.post(
  "/login",
  ValidInputMiddleware.checkValidEmail,
  ValidInputMiddleware.checkValidPassword,
  AdminController.login
);

// [POST] REFRESH TOKEN
router.post(
  "/forget-password/send-email",
  ValidInputMiddleware.checkValidEmail,
  AdminController.sendEmailForgetPassword
);

// [POST] REFRESH TOKEN
router.post(
  "/forget-password/check-key",
  ValidInputMiddleware.checkValidEmail,
  AdminController.checkForgetKey
);

// [POST] REFRESH TOKEN
router.post(
  "/forget-password",
  ValidInputMiddleware.checkValidEmail,
  ValidInputMiddleware.checkValidPassword,
  AdminController.forgetPassword
);

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
router.get("/", AuthenMiddleware.authentication, AdminController.getUser);

module.exports = router;

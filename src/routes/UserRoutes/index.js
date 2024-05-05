const express = require("express");
const router = express.Router();
const UserController = require("../../controller/UserController");
const AuthenMiddleware = require("../../middlewares/Auth");
const ValidInputMiddleware = require("../../middlewares/ValidInput");

// [GET] ALL USERS
router.get("/getUsers", AuthenMiddleware.authentication, UserController.getUsers);

// [POST] SEND CONFIRM EMAIL
router.post(
  "/send/confirmEmail",
  ValidInputMiddleware.checkValidEmail,
  ValidInputMiddleware.checkValidPassword,
  ValidInputMiddleware.checkValidName,
  UserController.sendConfirmEmail
);

// [POST] CONFIRM CHANGE PASSWORD
router.post(
  "/send/changePassword",
  ValidInputMiddleware.checkValidEmail,
  UserController.sendConfirmChangePassword
);

// [POST] LOGIN
router.post(
  "/login/beta",
  ValidInputMiddleware.checkValidEmail,
  UserController.loginBeta
);

// [POST] LOGIN
router.post(
  "/login",
  ValidInputMiddleware.checkValidEmail,
  UserController.login
);

// [POST] REFRESH TOKEN
router.get("/refreshToken", UserController.refreshToken);

// [GET] CHECK CHANGE PASSWORD KEY
router.get("/checkPasswordKey", UserController.checkChangePasswordKey);

// [GET] CHECK CHANGE PASSWORD KEY
router.post("/changePassword", UserController.changePassword);

// [GET] USER
router.post("/email",  ValidInputMiddleware.checkValidEmail, UserController.getUserByEmail);

// [POST] BAN USER
router.post("/ban", UserController.banUser);

// [POST] UNBAN USER
router.post("/unban", UserController.unbanUser);

// [POST] CONFIRM EMAIL AND ADD USER
router.post("/beta", ValidInputMiddleware.checkValidEmail, UserController.creatUserBeta);

// [POST] CONFIRM EMAIL AND ADD USER
router.post("/", UserController.creatUser);

// [POST] UPDATE USER
router.patch("/:id", UserController.updateUser);

// [GET] USER
router.get("/", AuthenMiddleware.authentication, UserController.getUser);

module.exports = router;

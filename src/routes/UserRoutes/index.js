const express = require("express");
const router = express.Router();
const UserController = require("../../controller/UserController");
const UserMiddleware = require("../../middlewares/Auth");

// [GET] ALL USERS
router.get("/getUsers", UserMiddleware.Authentication, UserController.getUsers);

// [POST] SEND CONFIRM EMAIL
router.post(
  "/send/confirmEmail",
  UserMiddleware.checkValidEmail,
  UserMiddleware.checkValidPassword,
  UserMiddleware.checkValidName,
  UserController.sendConfirmEmail
);

// [POST] CONFIRM CHANGE PASSWORD
router.post(
  "/send/changePassword",
  UserMiddleware.checkValidEmail,
  UserController.sendConfirmChangePassword
);

// [POST] LOGIN
router.post(
  "/login",
  UserMiddleware.checkValidEmail,
  UserMiddleware.checkValidPassword,
  UserController.login
);

// [POST] REFRESH TOKEN
router.post("/refreshToken", UserController.refreshToken);

// [GET] CHECK CHANGE PASSWORD KEY
router.get("/checkPasswordKey", UserController.checkChangePasswordKey);

// [GET] CHECK CHANGE PASSWORD KEY
router.post("/changePassword", UserController.changePassword);

// [POST] BAN USER
router.post("/ban", UserController.banUser);

// [POST] UNBAN USER
router.post("/unban", UserController.unbanUser);

// [POST] CONFIRM EMAIL AND ADD USER
router.post("/", UserController.creatUser);

// [POST] UPDATE USER
router.patch("/:id", UserController.updateUser);

// [GET] USER
router.get("/:id", UserController.getUser);

module.exports = router;

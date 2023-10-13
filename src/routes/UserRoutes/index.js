const express = require("express");
const router = express.Router();
const UserController = require("../../controller/UserController");
const UserMiddleware = require("../../middlewares/Auth");

// [GET] ALL USERS
router.get("/getUsers", UserController.getUsers);

// [POST] SEND CONFIRM EMAIL
router.post(
  "/sendConfirmEmail",
  UserMiddleware.checkValiEmail,
  UserMiddleware.checkValidPassword,
  UserMiddleware.checkValidName,
  UserController.sendConfirmEmail
);

// [POST] LOGIN
router.post("/login", UserMiddleware.checkValiEmail, UserMiddleware.checkValidPassword, UserController.login);

// [POST] REFRESH TOKEN
router.post("/refreshToken", UserController.refreshToken);

// [POST] BAN USER
router.post("/ban", UserController.banUser);

// [POST] UNBAN USER
router.post("/unban", UserController.unbanUser);

// [POST] CONFIRM EMAIL AND ADD USER
router.post("/", UserController.creatUser);

// [GET] USER
router.get("/:id", UserController.getUser);

module.exports = router;

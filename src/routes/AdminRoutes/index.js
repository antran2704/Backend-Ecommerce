const express = require("express");
const router = express.Router();
const AdminController = require("../../controller/AdminController");
const UserMiddleware = require("../../middlewares/Auth");

// [GET] ALL USERS
router.get("/getUsers", UserMiddleware.authentication, AdminController.getUsers);

// [POST] LOGIN
router.post(
  "/login",
  UserMiddleware.checkValidEmail,
  UserMiddleware.checkValidPassword,
  AdminController.login
);

// [POST] REFRESH TOKEN
router.post("/refreshToken", AdminController.refreshToken);

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

// [GET] USER
router.get("/", UserMiddleware.authentication, AdminController.getUser);

module.exports = router;

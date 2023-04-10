const express = require("express");
const router = express.Router();
const UserController = require("../../controller/UserController");
const UserMiddleware = require("../../middlewares/UserMiddleware");

// [GET] ALL USERS
router.get("/getAllUsers", UserController.getAllUsers);

// [POST] SEND CONFIRM EMAIL
router.post("/sendConfirmEmail", UserMiddleware.checkValidData, UserController.sendConfirmEmail);

// [POST] CONFIRM EMAIL AND ADD USER
router.post("/confirmEmail", UserController.confirmEmail);

// [POST] LOGIN 
router.post("/login", UserController.login);

// [POST] REFRESH TOKEN
router.post("/refreshToken", UserController.refreshToken);

// [DELETE] USER

module.exports = router;
const express = require("express");
const router = express.Router();
const OrderController = require("../../controller/OrderController");

// [GET] SEARCH ODERS
router.get("/search", OrderController.searchOrders);

// [GET] ALL ODERS
router.get("/getAllOrders", OrderController.getAllOrders);

// [GET] AN ORDER
router.get("/:id", OrderController.getAnOrder);

// [POST] SEND EMAIL
router.post("/sendEmail", OrderController.sendEmail);

// [POST] AN ORDER
router.post("/", OrderController.addOrder);

// [PATCH] STATUS ORDER
router.patch("/status/:id", OrderController.changeStatusOrder)

// [PATCH] AN ORDER
router.patch("/:id", OrderController.changeOrder)

// [DELETE] AN ORDER
router.delete("/:id", OrderController.deleteOrder)

module.exports = router;
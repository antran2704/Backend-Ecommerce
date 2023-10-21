const express = require("express");
const router = express.Router();
const OrderController = require("../../controller/OrderController");

// [GET] SEARCH ODERS
router.get("/search", OrderController.searchOrders);

// [GET] ALL ODERS
router.get("/getOrders", OrderController.getOrders);

// [GET] AN ORDER
router.get("/user/:user_id", OrderController.getOrdersByUserId);

// [GET] AN ORDER
router.get("/:order_id", OrderController.getOrder);

// [POST] SEND EMAIL
router.post("/sendEmail", OrderController.sendEmail);

// [PATCH] STATUS ORDER
router.patch("/status/:order_id", OrderController.updateStatusOrder)

// [PATCH] AN ORDER
router.patch("/:order_id", OrderController.updateOrder)

// [DELETE] AN ORDER
router.delete("/:order_id", OrderController.deleteOrder)

// [POST] AN ORDER
router.post("/", OrderController.createOrder);

module.exports = router;
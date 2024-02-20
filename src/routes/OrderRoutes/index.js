const express = require("express");
const router = express.Router();
const OrderController = require("../../controller/OrderController");

// [GET] SEARCH ODERS
router.get("/search", OrderController.searchOrders);

// [GET] AN ORDER
router.get("/user/:user_id", OrderController.getOrdersByUserId);

// [GET] AN ORDER BY ID
router.get("/order_id/:order_id", OrderController.getOrderById);

// [GET] AN ORDER
router.get("/:order_id", OrderController.getOrder);

// [POST] SEND EMAIL
router.post("/sendEmail", OrderController.sendEmail);

// [PATCH] STATUS ORDER
router.patch("/status/:order_id", OrderController.updateOrderStatus)

// [PATCH] PAYMENT STATUS ORDER
router.patch("/payment_status/:order_id", OrderController.updatePaymentStatus)

// [PATCH] AN ORDER
router.patch("/:order_id", OrderController.updateOrder)

// [DELETE] AN ORDER
router.delete("/:order_id", OrderController.deleteOrder)

// [GET] ALL ODERS
router.get("/", OrderController.getOrders);

// [POST] AN ORDER
router.post("/", OrderController.createOrder);

module.exports = router;
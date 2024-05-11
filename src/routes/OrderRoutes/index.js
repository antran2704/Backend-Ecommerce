const express = require("express");
const router = express.Router();
const OrderController = require("../../controller/OrderController");
const AuthenMiddleware = require("../../middlewares/Auth");

// [GET] SEARCH ORDERS FOR USER
router.get("/search/user/:user_id", OrderController.searchOrdersForUser);

// [GET] SEARCH ODERS
router.get("/search", OrderController.searchOrders);

// [GET] AN ORDER BY ID
router.get("/order_id/:order_id", OrderController.getOrderById);

// [GET] AN ORDER
router.get("/:order_id", OrderController.getOrder);

// [POST] SEND EMAIL
router.post("/sendEmail", OrderController.sendEmail);

// [PATCH] STATUS ORDER
router.patch("/status/:order_id", AuthenMiddleware.authentication, OrderController.updateOrderStatus);

// [PATCH] PAYMENT STATUS ORDER
router.patch("/payment_status/:order_id", AuthenMiddleware.authentication, OrderController.updatePaymentStatus);

// [PATCH] AN ORDER
router.patch("/:order_id", AuthenMiddleware.authentication, OrderController.updateOrder);

// [DELETE] AN ORDER
router.delete("/:order_id", AuthenMiddleware.authentication, OrderController.deleteOrder);

// [GET] ALL ODERS
router.get("/", OrderController.getOrders);

// [POST] AN ORDER
router.post("/user/:user_id", OrderController.getOrdersByUserId);

// [POST] AN ORDER
router.post("/", AuthenMiddleware.authentication, OrderController.createOrder);

module.exports = router;

const express = require("express");
const router = express.Router();
const OrderController = require("../../controller/OrderController");

// [GET] ALL ODERS
router.get("/getAllOrders", OrderController.getAllOrders);

// [GET] AN ORDER
router.get("/:id", OrderController.getAnOrder);

// [POST] AN ORDER
router.post("/", OrderController.addOrder);

// [PATCH] AN ORDER
router.patch("/:id", OrderController.changeOrder)

// [DELETE] AN ORDER
router.delete("/:id", OrderController.deleteOrder)

module.exports = router;
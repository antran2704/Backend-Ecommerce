const express = require("express");
const router = express.Router();
const PaymentController = require("../../controller/PaymentController/VNPayController");
const OrderController = require("../../controller/OrderController");

router.post("/create_payment_url", PaymentController.createPayment);
router.get(
  "/response/:order_id",
  PaymentController.responsePayment,
  OrderController.updatePaymentStatus
);
module.exports = router;

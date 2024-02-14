const express = require("express");
const router = express.Router();
const PaymentController = require("../../controller/PaymentController/VNPayController");

router.post("/create_payment_url", PaymentController.createPayment);

module.exports = router;

const express = require("express");
const router = express.Router();
const CartController = require("../../controller/CartController");

// [POST] UPDATE PRODUCT CART
router.post("/:user_id", CartController.updateCart);

// [GET] CART BY USER ID
router.get("/:user_id", CartController.getCart);

module.exports = router;

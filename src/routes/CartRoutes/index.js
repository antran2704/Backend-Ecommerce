const express = require("express");
const router = express.Router();
const CartController = require("../../controller/CartController");

// [POST] DELETE ALL ITEMS IN CART
router.post("/deleteAll/:user_id", CartController.deleteAllItemCart);

// [POST] DELETE ITEM IN CART
router.post("/delete/:user_id", CartController.deleteItemCart);

// [POST] UPDATE PRODUCT CART
router.post("/:user_id", CartController.updateCart);

// [GET] DISCOUNT
router.get("/discount", CartController.useDiscount);

// [GET] CART BY USER ID
router.get("/:user_id", CartController.getCart);

module.exports = router;

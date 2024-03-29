const express = require("express");
const router = express.Router();
const CartController = require("../../controller/CartController");

// [POST] DELETE ALL ITEMS IN CART
router.post("/items/:user_id", CartController.deleteAllItemCart);

// [POST] DELETE ITEM IN CART
router.post("/item/:user_id", CartController.deleteItemCart);

// [POST] UPDATE PRODUCT CART
router.post("/increase/:user_id", CartController.increaseCart);

// [POST] UPDATE PRODUCT CART
router.post("/update/:user_id", CartController.updateCart);

// [POST] CHECK INVENTORY ITEM
router.post("/check_inventory/:user_id", CartController.checkInventoryItem);

// [GET] CART BY USER ID
router.get("/:user_id", CartController.getCart);

module.exports = router;

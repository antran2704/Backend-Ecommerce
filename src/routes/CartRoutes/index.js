const express = require("express");
const router = express.Router();
const CartController = require("../../controller/CartController");
const CartMiddleware = require("../../middlewares/Cart");

// [POST] DELETE ALL ITEMS IN CART
router.post("/items/:user_id", CartController.deleteAllItemCart);

// [POST] DELETE ITEM IN CART
router.post("/item/:user_id", CartController.deleteItemCart);

// [POST] UPDATE PRODUCT CART
router.post(
  "/increase/:user_id",
  CartMiddleware.checkInventoryProduct,
  CartController.increaseCart
);

// [POST] UPDATE PRODUCT CART
router.post(
  "/update/:user_id",
  CartMiddleware.checkInventoryProduct,
  CartController.updateCart
);

// [POST] CHECK INVENTORY ITEM
router.post("/check_inventory/:user_id", CartController.checkInventoryItem);

// [GET] CART BY USER ID
router.get("/items/:user_id", CartController.getItemsInCart);

// [GET] CART BY USER ID
router.get("/:user_id", CartController.getCart);

module.exports = router;

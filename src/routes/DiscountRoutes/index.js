const express = require("express");
const router = express.Router();
const DiscountController = require("../../controller/DiscountController");
const AuthenMiddleware = require("../../middlewares/Auth");
const multer = require("../../middlewares/Multer");
const DiscountMiddleware = require("../../middlewares/Discount");
const { ImageMiddleware } = require("../../middlewares/Image");
const { ROLE, PERMISION } = require("../../common");

// router.use(AuthenMiddleware.authentication);
// router.use(
//   AuthenMiddleware.authorization(
//     [ROLE.ADMIN, ROLE.STAFF],
//     [PERMISION.ADMIN, PERMISION.STAFF]
//   )
// );

router.get(
  "/search",
  AuthenMiddleware.authentication,
  AuthenMiddleware.authorization(
    [ROLE.ADMIN, ROLE.STAFF],
    [PERMISION.ADMIN, PERMISION.STAFF]
  ),
  DiscountController.searchDiscounts
);

router.patch(
  "/:id",
  AuthenMiddleware.authentication,
  AuthenMiddleware.authorization([ROLE.ADMIN], [PERMISION.ADMIN]),
  DiscountController.updateDiscount
);

router.delete(
  "/:discount_id",
  AuthenMiddleware.authentication,
  AuthenMiddleware.authorization([ROLE.ADMIN], [PERMISION.ADMIN]),
  DiscountController.deleteDiscount
);

// UPLOAD THUMBNAIL
router.post(
  "/uploadThumbnail",
  AuthenMiddleware.authentication,
  AuthenMiddleware.authorization([ROLE.ADMIN], [PERMISION.ADMIN]),
  multer.upload("./uploads/discount").single("thumbnail"),
  ImageMiddleware.checkPathImage,
  DiscountController.uploadThumbnail
);

// [POST] GET DISCOUNT ON CLIENT BY CODE ID
router.post(
  "/client",
  AuthenMiddleware.authentication,
  AuthenMiddleware.authorization(
    [ROLE.ADMIN, ROLE.USER],
    [PERMISION.ADMIN, PERMISION.USER]
  ),
  DiscountMiddleware.checkDiscount,
  DiscountController.getDiscount
);

// [POST] USE DISCOUNT
router.post(
  "/use",
  AuthenMiddleware.authentication,
  AuthenMiddleware.authorization(
    [ROLE.ADMIN, ROLE.USER],
    [PERMISION.ADMIN, PERMISION.USER]
  ),
  DiscountMiddleware.checkDiscount,
  DiscountController.useDiscount
);

// [POST] CREATE DISCOUNT
router.post(
  "/",
  AuthenMiddleware.authentication,
  AuthenMiddleware.authorization([ROLE.ADMIN], [PERMISION.ADMIN]),
  DiscountController.createDiscount
);

// [GET] GET DISCOUNT BY CODE ID
router.get(
  "/id/:discount_id",
  AuthenMiddleware.authentication,
  DiscountController.getDiscountById
);

// [GET] GET DISCOUNT BY CODE ID
router.get(
  "/:discount_code",
  AuthenMiddleware.authentication,
  DiscountController.getDiscount
);

// [GET] GET DISCOUNTs
router.get(
  "/",
  AuthenMiddleware.authentication,
  AuthenMiddleware.authorization(
    [ROLE.ADMIN, ROLE.STAFF],
    [PERMISION.ADMIN, PERMISION.STAFF]
  ),
  DiscountController.getDiscounts
);

module.exports = router;

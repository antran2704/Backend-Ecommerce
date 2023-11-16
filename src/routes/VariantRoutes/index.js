const express = require("express");
const router = express.Router();
const VariantController = require("../../controller/VariantController");

// [SEARCH] VARIANTS
router.get("/search", VariantController.searchAttributes);

// [GET] VARIANT BY CODE
router.get("/getByCode/:code", VariantController.getVariantByCode);

// [PATCH] DELETE CHILD IN VARIANT
router.patch("/child/delete", VariantController.deleteChildInVariant);

// [POST] ADD CHILD IN VARIANT
router.post("/child/:id", VariantController.addChildInVariant);

// [PATCH] UPDATE CHILD IN VARIANT
router.patch("/child/:id", VariantController.updateChildInVariant);

// [PATCH] UPDATE VARIANT
router.patch("/:id", VariantController.updateVariant);

// [DELETE] DELETE VARIANT
router.delete("/:id", VariantController.deleteVariant);

// [POST] CREATE VARIANT
router.post("/", VariantController.createVariant);

// [GET] VARIANT BY ID
router.get("/:id", VariantController.getVariantById);

// [GET] VARIANTS
router.get("/", VariantController.getVariants);


module.exports = router;

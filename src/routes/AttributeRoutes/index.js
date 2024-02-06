const express = require("express");
const router = express.Router();
const AttributeController = require("../../controller/AttributeController");

// [SEARCH] ATTRIBUTE
router.get("/search", AttributeController.searchAttributes);

// [SEARCH] ATTRIBUTE AVAILABLE
router.get("/available", AttributeController.getAttributesAvailable);

// [GET] ATTRIBUTE BY CODE
router.get("/getByCode/:code", AttributeController.getAttributeByCode);

// [PATCH] DELETE CHILD IN ATTRIBUTE
router.patch("/child/delete", AttributeController.deleteChildInAttribute);

// [POST] ADD CHILD IN ATTRIBUTE
router.post("/child/:id", AttributeController.addChildInAttribute);

// [PATCH] UPDATE CHILD IN ATTRIBUTE
router.patch("/child/:id", AttributeController.updateChildInAttibute);

// [GET] ATTRIBUTE
router.get("/all", AttributeController.getAttributes);

// [PATCH] UPDATE ATTRIBUTE
router.patch("/:id", AttributeController.updateAttribute);

// [DELETE] DELETE ATTRIBUTE
router.delete("/:id", AttributeController.deleteAttribute);

// [GET] ATTRIBUTE BY ID
router.get("/:id", AttributeController.getAttributeById);

// [POST] CREATE ATTRIBUTE
router.post("/", AttributeController.createAttribute);

// [GET] ATTRIBUTE
router.get("/", AttributeController.getAttributesWithPage);

module.exports = router;

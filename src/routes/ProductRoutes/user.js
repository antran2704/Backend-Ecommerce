const express = require("express");
const router = express.Router();

const ProductController = require("../../controller/ProductController/user");

// [GET] ALL PRODUCT
router.get(
  "/category/:id",
  ProductController.getProductsInCategory
);

// [SEARCH] A PRODUCT
router.get("/search", ProductController.searchProduct);

// [GET] A PRODUCT WITH ID
router.get("/id/:id", ProductController.getProductById);

// [GET] A PRODUCT WITH ID
router.get("/other", ProductController.getOtherProducts);

// [GET] A PRODUCT WITH ID
router.get("/hot", ProductController.getHotProducts);

// [GET] A PRODUCT
router.get("/:slug", ProductController.getProduct);

// [GET] ALL PRODUCTS
router.get("/", ProductController.getProducts);

module.exports = router;

// ------------------- SWAGGER ---------------------

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The product ID
 *         title:
 *           type: string
 *           description: Title of product
 *         slug:
 *           type: string
 *           description: Slug of product
 *         categories: 
 *           type: array string
 *           description: Categories of product
 *         category: 
 *           type: string
 *           description: Category of product
 *         description: 
 *           type: string
 *           description: Description of product
 *         price: 
 *           type: float
 *           description: price of product
 *         promotion_price: 
 *           type: float
 *           description: Promotion price of product
 */


/**
 * @swagger
 *  /products?page={page}:
 *   get:
 *     description: Get list products with page
 *     responses:
 *              '200':
 *                  description: Successfully returned paginated records
 *              '404':
 *                  description: Bad request
 *              '500':
 *                  description: Internal server
 *     parameters:
 *          - name: page
 *            in: query
 *            description: Page of product
 *            default: 1
 *            schema:
 *              type: string
 *              format: string
*/

// ------------------- SWAGGER ---------------------
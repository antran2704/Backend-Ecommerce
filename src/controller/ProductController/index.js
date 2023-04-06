const { Product } = require("../../models/index");

const ProductController = {
  // [GET] ALL PRODUCT
  getAllProduct: async (req, res) => {
    try {
      const products = await Product.find({});
      res.status(200).json({
        status: 200,
        payload: products,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [GET] A PRODUCT
  getAProduct: async (req, res) => {
    const { slug } = req.params;
    try {
      const product = await Product.find({ slug });
      if (!product) {
        res.status(404).json({
          status: 404,
          message: "Product not exit",
        });
        return;
      }
      res.status(200).json({
        status: 200,
        payload: product,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [POST] A PRODUCT
  addProduct: async (req, res) => {
    try {
      const data = req.body;
      const newProduct = await new Product(data);
      newProduct.save();
      res.status(200).json({
        status: 200,
        message: "Add new product succesfully",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [PATCH] A PRODUCT
  changeProduct: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
      const product = await Product.findById({ _id: id });
      if (!product) {
        res.status(404).json({
          status: 404,
          message: "Product not exit",
        });
        return;
      }
      await product.update(data);
      res.status(200).json({
        status: 200,
        message: "Updated product succesfully",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [DELETE] A PRODUCT
  deleteProduct: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findById({ _id: id });
      if (!product) {
        res.status(404).json("Product not exit");
        return;
      }
      await product.remove();
      res.status(200).json({
        status: 200,
        message: "Deleted product succesfully",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = ProductController;

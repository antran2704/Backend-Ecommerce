const { Product } = require("../../models/index");
const { Category } = require("../../models/index");

const PAGE_SIZE = 16;

const ProductController = {
  // [GET] ALL PRODUCT
  getAllProduct: async (req, res) => {
    const currentPage = req.query.page ? req.query.page : 1;

    try {
      const totalItems = await Product.find({});
      const products = await Product.find({})
        .skip((currentPage - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);

      return res.status(200).json({
        status: 200,
        payload: products,
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // [GET] ALL PRODUCT FOLLOW CATEGORY
  getAllProductInCategory: async (req, res) => {
    const { id } = req.params;
    const currentPage = req.query.page ? Number(req.query.page) : 1;
    let products = null;
    let totalItems;

    try {
      if (req.query.gte || req.query.lte) {
        const gte = Number(req.query.gte);
        const lte = Number(req.query.lte);

        if (gte > lte) {
          totalItems = await Product.find({
            category: id,
            ...req.query,
          });

          products = await await Product.find({
            category: id,
            ...req.query,
          })
            .limit(PAGE_SIZE)
            .skip((currentPage - 1) * PAGE_SIZE);
        } else {
          totalItems = await Product.find({
            category: id,
            ...req.query,
            price: {
              $gte: gte,
              $lte: lte,
            },
          });

          products = await Product.find({
            category: id,
            ...req.query,
          })
            .limit(PAGE_SIZE)
            .skip((currentPage - 1) * PAGE_SIZE);
        }
      } else {
        totalItems = await Product.find({
          category: id,
          ...req.query,
        });

        products = await Product.find({
          category: id,
          ...req.query,
        })
          .limit(PAGE_SIZE)
          .skip((currentPage - 1) * PAGE_SIZE);
      }

      if (!products) {
        return res.status(404).json({
          status: 404,
          message: "No item in category",
        });
      }

      return res.status(200).json({
        status: 200,
        payload: products,
        pagination: {
          pageSize: PAGE_SIZE,
          currentPage,
          totalItems: totalItems.length,
        },
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // [GET] A PRODUCT
  getAProduct: async (req, res) => {
    const { slug } = req.params;
    try {
      const product = await Product.findOne({ slug }).populate("category", {
        title: 1,
        slug: 1,
      });

      if (!product) {
        return res.status(404).json({
          status: 404,
          message: "Product not exit",
        });
      }

      return res.status(200).json({
        status: 200,
        payload: product,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // [GET] CATEGORY
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find({}, {title: 1, options: 1});

      if (!categories) {
        return res.status(404).json({
          status: 404,
          message: "Categories not exit",
        });
      }

      return res.status(200).json({
        status: 200,
        payload: categories,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // [POST] A PRODUCT
  addProduct: async (req, res) => {
    const data = req.body;
   
    try {
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
        return res.status(404).json({
          status: 404,
          message: "Product not exit",
        });
      }

      await product.update(data);

      return res.status(200).json({
        status: 200,
        message: "Updated product succesfully",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // [SEARCH PRODUCT]
  searchProduct: async (req, res) => {
    const query = req.query;
    const searchText = query.search;
    console.log(query);
    const currentPage = query.page ? query.page : 1;
    try {
      const totalItems = await Product.find({
        name: { $regex: searchText, $options: "i" },
      });
      const products = await Product.find({
        name: { $regex: searchText, $options: "i" },
      })
        .skip((currentPage - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);

      return res.status(200).json({
        status: 200,
        payload: products,
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  // [DELETE] A PRODUCT
  deleteProduct: async (req, res) => {
    const { id } = req.params;

    try {
      const product = await Product.findById({ _id: id });
      if (!product) {
        return res.status(404).json("Product not exit");
      }

      await product.remove();

      return res.status(200).json({
        status: 200,
        message: "Deleted product succesfully",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = ProductController;

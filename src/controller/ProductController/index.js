const { Product } = require("../../models/index");
const { Category } = require("../../models/index");

const PAGE_SIZE = 16;

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
  // [GET] ALL PRODUCT FOLLOW CATEGORY
  getAllProductInCategory: async (req, res) => {
    const { id } = req.params;
    const currentPage = req.query.page ? Number(req.query.page) : 1;
    let products = null;

    try {
      if (req.query.gte || req.query.lte) {
        const gte = Number(req.query.gte);
        const lte = Number(req.query.lte);

        if (gte > lte) {
          products = await Product.find({
            category: id,
            ...req.query,
          })
            .limit(PAGE_SIZE)
            .skip((currentPage - 1) * PAGE_SIZE);
        } else {
          products = await Product.find({
            category: id,
            ...req.query,
            price: {
              $gte: gte,
              $lte: lte,
            },
          })
            .limit(PAGE_SIZE)
            .skip((currentPage - 1) * PAGE_SIZE);
        }
      } else {
        products = await Product.find({
          category: id,
          ...req.query,
        })
          .limit(PAGE_SIZE)
          .skip((currentPage - 1) * PAGE_SIZE);
      }

      if (!products) {
        res.status(404).json({
          status: 404,
          message: "No item in category",
        });
        return;
      }
      res.status(200).json({
        status: 200,
        payload: products,
        pagination: {
          pageSize: PAGE_SIZE,
          currentPage,
          totalItems: products.length,
        },
      });
    } catch (error) {
      res.status(500).json(error);
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
    const { category, brand } = req.body;
    const name = "Brand";
    const categoryId = category;
    try {
      const data = req.body;
      const newProduct = await new Product(data);
      newProduct.save();

      const categoryExit = await Category.findById({ _id: categoryId });

      if (!categoryExit) {
        res.status(404).json("Category not exit");
        return;
      }

      const categoryFilterExit = await Category.findOne({
        filters: { $elemMatch: { title: name } },
      });

      if (!categoryFilterExit) {
        await categoryExit.updateOne({
          $push: {
            filters: {
              title: name,
              listFilterItem: [brand],
            },
          },
        });
      } else {
        const listFilter = categoryExit.filters;
        const index = listFilter.findIndex((item) => {
          if (item.title === name && !item.listFilterItem.includes(brand)) {
            return item;
          }
        });

        if (index !== -1) {
          listFilter[index].listFilterItem.push(brand);
          await categoryExit.updateOne({ filters: listFilter });
        }
      }
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

const { Product, Category } = require("../../models/index");
const { getDateTime } = require("../../helpers/getDateTime");

class ProductServices {
  async getProducts() {
    const items = await Product.find({});

    return items;
  }

  async getProductsWithPage(pageSize, currentPage) {
    const products = await Product.find({})
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    return products;
  }

  async getProductsInCategory(category_id) {
    const category = await Category.findById({ _id: category_id });

    if (!category) {
      return null;
    }

    const products = await Product.find({ category: category_id });

    return products;
  }

  async getProductsInCategoryWithPage(category_id, pageSize, currentPage) {
    const products = await Product.find({ category: category_id })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    return products;
  }

  async getProductsFilter(
    category_id,
    keys = null,
    values = null,
    lte = null,
    gte = null
  ) {
    const category = await Category.findById({ _id: category_id });
    if (!category) {
      return null;
    }

    // case 3: filter voi option va gia
    if (keys.length > 0 && lte !== null && gte !== null) {
      console.log("case co moi gia va options");
      const products = await Product.find({
        category: category_id,
        options: { $elemMatch: { code: { $in: keys } } },
        "options.values": { $elemMatch: { label: { $in: values } } },
        price: { $gte: gte, $lte: lte },
        // $or: [{ price: { $gte: gte, $lte: lte } }, { price: { $gte: gte } }, { price: { $lte: lte } }],
      });

      return products;
    }

    // case 4: filter moi gia
    if (lte !== null && gte !== null) {
      console.log("case co 2 gia");
      const products = await Product.find({
        category: category_id,
        price: { $gte: gte, $lte: lte },
      });
      return products;
    }

    // case 1: filter moi gia
    if (lte !== null || gte !== null) {
      console.log("case co moi gia");
      const products = await Product.find({
        category: category_id,
        $or: [{ price: { $gte: gte } }, { price: { $lte: lte } }],
      });

      return products;
    }

    // case 2: filter ko co gia
    if (keys.length > 0) {
      console.log("case co moi options");
      const products = await Product.find({
        category: category_id,
        options: { $elemMatch: { code: { $in: keys } } },
        "options.values": { $elemMatch: { label: { $in: values } } },
      });

      return products;
    }
  }

  async getProductsFilterWithPage(
    category_id,
    keys = null,
    values = null,
    pageSize,
    currentPage,
    lte = null,
    gte = null
  ) {
    // case 3: filter voi option va gia
    if (keys.length > 0 && lte !== null && gte !== null) {
      const products = await Product.find({
        category: category_id,
        options: { $elemMatch: { code: { $in: keys } } },
        "options.values": { $elemMatch: { label: { $in: values } } },
        price: { $gte: gte, $lte: lte },
      })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);

      return products;
    }

    // case 4: filter moi gia
    if (lte !== null && gte !== null) {
      const products = await Product.find({
        category: category_id,
        price: { $gte: gte, $lte: lte },
      })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);

      return products;
    }

    // case 1: filter moi gia
    if (lte !== null || gte !== null) {
      const products = await Product.find({
        category: category_id,
        $or: [{ price: { $gte: gte } }, { price: { $lte: lte } }],
      })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);

      return products;
    }

    // case 2: filter ko co gia
    if (keys.length > 0) {
      const products = await Product.find({
        category: category_id,
        options: { $elemMatch: { code: { $in: keys } } },
        "options.values": { $elemMatch: { label: { $in: values } } },
      })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize);

      return products;
    }
  }

  async getProduct(slug) {
    if (!slug) {
      return null;
    }

    const product = await Product.find({ slug }).populate("category", {
      title: 1,
      slug: 1,
      options: 1,
    });

    return product;
  }

  async getProductById(id, select = {}) {
    if (!id) return null;
    
    const product = await Product.findById({ _id: id })
      .populate("category", {
        title: 1,
        slug: 1,
        options: 1,
      })
      .select({ ...select });

    return product;
  }

  async createProduct(payload) {
    if (!payload.category) return null;

    const newProduct = await Product.create(payload);
    return newProduct;
  }

  async updateProduct(id, payload) {
    if (!id) return null;

    const date = getDateTime();
    const product = await Product.findByIdAndUpdate(
      { _id: id },
      { $set: { ...payload, updatedAt: date } }
    );

    return product;
  }

  async searchTextItems(text) {
    const totalItems = await Product.find({
      title: { $regex: text, $options: "i" },
    });
    return totalItems;
  }

  async searchTextWithPage(text, pageSize, currentPage) {
    const items = await Product.find({
      title: { $regex: text, $options: "i" },
    })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    return items;
  }

  async deleteProduct(id) {
    if (!id) return null;

    const product = await Product.findByIdAndDelete({ _id: id });
    return product;
  }
}

module.exports = new ProductServices();

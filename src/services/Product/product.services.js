const { Product, Category } = require("../../models/index");
const { getDateTime } = require("../../helpers/getDateTime");
const { NotificationAdminServices, NotificationTypes } = require("../Notification");
const { ADMIN_NOTIFI_PATH } = require("../../controller/NotificationController/data");

class ProductServices {
  async getProducts(query = {}) {
    const items = await Product.find({
      ...query,
      isDeleted: false,
    }).lean();

    return items;
  }

  async getProductsWithPage(pageSize, currentPage, select = null, query = {}) {
    const products = await Product.find({ ...query, isDeleted: false })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .populate("category", {
        _id: 1,
        title: 1,
        slug: 1,
      })
      .select({ ...select })
      .lean();

    return products;
  }

  async getProductsInCategory(category_id) {
    const category = await Category.findById({
      _id: category_id,
      isDeleted: false,
    });

    if (!category) {
      return null;
    }

    const products = await Product.countDocuments({
      category: category_id,
      isDeleted: false,
    }).lean();

    return products;
  }

  async getProductsInCategoryWithPage(category_id, pageSize, currentPage) {
    const products = await Product.find({
      category: category_id,
      isDeleted: false,
    })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return products;
  }

  async getProductsFilter(
    category_id,
    search = "",
    keys = null,
    values = null,
    lte = null,
    gte = null,
    query = {}
  ) {
    const category = await Category.findById({
      _id: category_id,
      isDeleted: false,
    });
    if (!category) {
      return null;
    }

    const queryFilter = {};

    if (lte !== null && gte !== null) {
      queryFilter["$or"] = [
        { $and: [{ price: { $gte: gte } }, { price: { $lte: lte } }] },
        {
          $and: [
            { promotion_price: { $gt: 0 } },
            { promotion_price: { $gte: gte } },
            { promotion_price: { $lte: lte } },
          ],
        },
      ];
    }

    if (keys.length > 0) {
      queryFilter["options"] = { $elemMatch: { code: { $in: keys } } };
      queryFilter["options.values"] = {
        $elemMatch: { label: { $in: values } },
      };
    }

    const products = await Product.countDocuments({
      ...query,
      category: category_id,
      isDeleted: false,
      title: { $regex: search, $options: "i" },
      ...queryFilter,
    }).lean();

    return products;
  }

  async getProductsFilterWithPage(
    category_id,
    search = "",
    keys = null,
    values = null,
    pageSize,
    currentPage,
    lte = null,
    gte = null,
    query = {}
  ) {
    const queryFilter = {};

    if (lte !== null && gte !== null) {
      queryFilter["$or"] = [
        { $and: [{ price: { $gte: gte } }, { price: { $lte: lte } }] },
        {
          $and: [
            { promotion_price: { $gt: 0 } },
            { promotion_price: { $gte: gte } },
            { promotion_price: { $lte: lte } },
          ],
        },
      ];
    }

    if (keys.length > 0) {
      queryFilter["options"] = { $elemMatch: { code: { $in: keys } } };
      queryFilter["options.values"] = {
        $elemMatch: { label: { $in: values } },
      };
    }

    const products = await Product.find({
      ...query,
      category: category_id,
      isDeleted: false,
      title: { $regex: search, $options: "i" },
      ...queryFilter,
    })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return products;
  }

  async getProduct(slug, query) {
    if (!slug) {
      return null;
    }

    const product = await Product.findOne({
      slug,
      isDeleted: false,
      ...query,
    })
      .populate("category", {
        title: 1,
        slug: 1,
      })
      .populate("breadcrumbs", {
        title: 1,
        slug: 1,
      });

    return product;
  }

  async getProductById(id, select = null, query = {}) {
    if (!id) return null;

    const product = await Product.findById({
      _id: id,
      isDeleted: false,
      ...query,
    })
      .populate("category", {
        title: 1,
        slug: 1,
      })
      .populate("categories", {
        title: 1,
        slug: 1
      })
      .populate("variations")
      .select({ ...select });

    return product;
  }

  async createProduct(payload) {
    if (!payload.category) return null;

    const newProduct = await Product.create(payload);
    return newProduct;
  }

  async updateProduct(id, payload, query = {}) {
    if (!id) return null;
    const date = getDateTime();
    const product = await Product.findByIdAndUpdate(
      { _id: id },
      { $set: { ...payload, updatedAt: date }, ...query },
      { new: true, upsert: true }
    );

    if (product.inventory <= 10) {
      const link = `${ADMIN_NOTIFI_PATH.PRODUCT}/${product._id}`;

      const dataNotification = {
        content: `${product.title} còn lại ${product.inventory} sản phẩm`,
        type: NotificationTypes.Product,
        path: link,
      };

      NotificationAdminServices.createNotification(dataNotification);
    }

    return product;
  }

  async searchTextItems(text, category = "", query = {}) {
    let totalItems;

    if (category.length > 0) {
      totalItems = await Product.countDocuments({
        ...query,
        category,
        title: { $regex: text, $options: "i" },
        isDeleted: false,
      });

      return totalItems;
    }

    totalItems = await Product.find({
      ...query,
      title: { $regex: text, $options: "i" },
      isDeleted: false,
    });
    return totalItems;
  }

  async searchTextWithPage(
    text,
    category = "",
    pageSize,
    currentPage,
    query = {},
    select = null
  ) {
    let products;

    if (category.length > 0) {
      products = await Product.find({
        ...query,
        category,
        title: { $regex: text, $options: "i" },
        isDeleted: false,
      })
        .populate("category", {
          _id: 1,
          title: 1,
          slug: 1,
        })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .select({ ...select });

      return products;
    }

    products = await Product.find({
      ...query,
      title: { $regex: text, $options: "i" },
      isDeleted: false,
    })
      .populate("category", {
        _id: 1,
        title: 1,
        slug: 1,
      })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .select({ ...select });
    return products;
  }

  async deleteProduct(id) {
    if (!id) return null;

    const date = getDateTime();
    const product = await Product.findByIdAndUpdate(
      { _id: id },
      { $set: { isDeleted: true, updatedAt: date } },
      { new: true, upsert: true }
    );
    return product;
  }
}

module.exports = new ProductServices();

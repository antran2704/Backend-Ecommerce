const {
  typeStatus,
  templateEmail,
  paymentStatus,
  paymentMethod,
} = require("./status");
const handleSendMail = require("../../configs/mailServices");

const {
  InternalServerError,
  NotFoundError,
  BadResquestError,
} = require("../../helpers/errorResponse");
const {
  GetResponse,
  CreatedResponse,
} = require("../../helpers/successResponse");
const {
  OrderServices,
  GrossDateServices,
  GrossMonthServices,
  CartServices,
  ProductItemServices,
  ProductServices,
  NotificationAdminServices,
  CacheCartServices,
  InventoryServices,
  CacheProductServices,
} = require("../../services");
const { GrossYearServices } = require("../../services/Gross");
const { isValidObjectId } = require("mongoose");
const { NotificationTypes } = require("../../services/Notification");
const { ADMIN_NOTIFI_PATH } = require("../NotificationController/data");
const { checkValidEmail } = require("../../helpers/email");

const OrderController = {
  // [GET] ORDERS
  getOrders: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE);
    const { page } = req.query;
    const currentPage = page ? Number(page) : 1;

    try {
      const totalItems = await OrderServices.getOrders();

      const orders = await OrderServices.getOrdersWithPage(
        PAGE_SIZE,
        currentPage
      );

      if (!orders) {
        return new NotFoundError(404, "No order found!").send(res);
      }

      return new GetResponse(200, orders).send(res, {
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  // [GET] ORDERS BY USER ID
  getOrdersByUserId: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE);
    const { page } = req.query;
    const currentPage = page ? Number(page) : 1;

    const { user_id } = req.params;
    const data = req.body;

    if (!user_id || !isValidObjectId(user_id)) {
      return new BadResquestError().send(res);
    }

    try {
      const totalItems = await OrderServices.getOrdersByUserId(user_id, data);

      const orders = await OrderServices.getOrdersByUserIdWithPage(
        user_id,
        PAGE_SIZE,
        currentPage,
        data
      );

      return new GetResponse(200, orders).send(res, {
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  // [GET] AN ORDER
  getOrder: async (req, res) => {
    const { order_id } = req.params;

    if (!isValidObjectId(order_id)) {
      return new BadResquestError().send(res);
    }

    try {
      const order = await OrderServices.getOrder(order_id);

      return new GetResponse(200, order).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  getOrderById: async (req, res) => {
    const { order_id } = req.params;

    if (!order_id) {
      return new BadResquestError().send(res);
    }

    try {
      const order = await OrderServices.getOrderByOrderID(order_id);
      if (!order) {
        return new NotFoundError(404, "Not found order").send(res);
      }

      return new GetResponse(200, order).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  // [POST] AN ORDER
  createOrder: async (req, res) => {
    const data = req.body;

    if (!data) {
      return new BadResquestError().send(res);
    }

    if (
      !data.payment_status ||
      !data.payment_method ||
      !paymentStatus[data.payment_status] ||
      !paymentMethod[data.payment_method]
    ) {
      return new BadResquestError(400, { message: "Invalid data" }).send(res);
    }

    if (!data.user_infor.email || !checkValidEmail(data.user_infor.email)) {
      return new BadResquestError(400, { message: "Invalid data" }).send(res);
    }

    try {
      const newOrder = await OrderServices.createOrder(data);

      if (!newOrder) {
        return new BadResquestError(400, "Create new order failed").send(res);
      }

      const cart = await CartServices.getCartByUserId(data.user_id);

      if (!cart || cart.cart_count === 0) {
        return new BadResquestError().send(res);
      }

      // send notifi if product out of stock
      for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];

        if (item.variation) {
          const product = await ProductItemServices.getProductItemById(
            item.variation
          );

          if (!product) {
            return new BadResquestError().send(res);
          }

          const inventoryProduct = await InventoryServices.getInventory(
            product._id
          );

          if (inventoryProduct.inventory_stock - item.quantity <= 0) {
            const link = `${ADMIN_NOTIFI_PATH.PRODUCT}/${product.product_id}`;

            const dataNotification = {
              content: `${product.title} hết hàng`,
              type: NotificationTypes.Product,
              path: link,
            };

            NotificationAdminServices.createNotification(dataNotification);
          }
        }

        if (item.product) {
          const product = await ProductServices.getProductById(item.product);

          if (!product) {
            return new BadResquestError().send(res);
          }

          const inventoryProduct = await InventoryServices.getInventory(
            product._id
          );

          if (inventoryProduct.inventory_stock - item.quantity <= 0) {
            const link = `${ADMIN_NOTIFI_PATH.PRODUCT}/${product.product_id}`;

            const dataNotification = {
              content: `${product.title} hết hàng`,
              type: NotificationTypes.Product,
              path: link,
            };

            NotificationAdminServices.createNotification(dataNotification);
          }
        }
      }

      // update sold and inventory for product
      for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];

        // update inventory for product
        InventoryServices.updateInventory(
          item.product,
          {},
          { $inc: { inventory_stock: -item.quantity } }
        );

        // update sold count for product
        ProductServices.updateProduct(
          item.product,
          {},
          { $inc: { sold: item.quantity } }
        );

        // check cache and update cache
        const cacheProduct = await CacheProductServices.getProduct(
          CacheProductServices.KEY_PRODUCT + item.product
        );

        if (cacheProduct) {
          await CacheProductServices.updateCacheProduct(
            CacheProductServices.KEY_PRODUCT + item.product,
            { ...cacheProduct, sold: cacheProduct.sold + item.quantity }
          );
        }

        if (item.variation) {
          // update inventory for variation of product
          InventoryServices.updateInventory(
            item.variation,
            {},
            { $inc: { inventory_stock: -item.quantity } }
          );

          // update sold count for variation of product
          ProductItemServices.updateProductItem(
            item.variation,
            {},
            { $inc: { sold: item.quantity } }
          );
        }
      }

      // send mail new order with card payment method
      if (
        newOrder.payment_status === paymentStatus.pending &&
        newOrder.payment_method === paymentMethod.banking
      ) {
        const link = `${process.env.ADMIN_ENDPOINT}/orders/${newOrder._id}`;
        let mailContent = {
          to: process.env.SHOP_EMAIL,
          subject: "Antran shop thông báo:",
          template: templateEmail.order.template,
          context: {
            link,
          },
        };

        const dataNotification = {
          content: "Đơn hàng mới",
          type: NotificationTypes.Order,
          path: `${ADMIN_NOTIFI_PATH.ORDER}/${newOrder._id}`,
        };

        NotificationAdminServices.createNotification(dataNotification);

        handleSendMail(mailContent);

        const date = new Date(newOrder.createdAt);

        // update for gross day
        let grossDay;

        const grossDayQuery = {
          $push: { orders: newOrder._id },
          $inc: { sub_gross: newOrder.total },
        };

        grossDay = await GrossDateServices.getGrossInDay(
          date.toLocaleDateString("en-GB")
        );

        if (!grossDay) {
          grossDay = await GrossDateServices.createGross(date);
        }

        GrossDateServices.updateGross(grossDay._id, grossDayQuery);

        // update for gross month
        let grossMonth;
        const grossMonthQuery = {
          $inc: { orders: 1, sub_gross: newOrder.total },
        };

        grossMonth = await GrossMonthServices.getGrossByMonth(
          date.getMonth() + 1,
          date.getFullYear()
        );

        if (!grossMonth) {
          grossMonth = await GrossMonthServices.createGross(date);
        }
        GrossMonthServices.updateGross(grossMonth._id, grossMonthQuery);

        // update gross year
        let grossYear;
        const grossYearQuery = {
          $inc: { orders: 1, sub_gross: newOrder.total },
        };

        grossYear = await GrossYearServices.getGrossByYear(date.getFullYear());

        if (!grossYear) {
          grossYear = await GrossYearServices.createGross(date);
        }

        GrossYearServices.updateGross(grossYear._id, grossYearQuery);
      }

      CartServices.deleteAllItemCart(cart._id);
      CartServices.updateCart(newOrder.user_id, {
        cart_count: 0,
        cart_total: 0,
      });

      // check cache cart
      const cacheCart = await CacheCartServices.getCart(
        CacheCartServices.KEY_CART + newOrder.user_id
      );

      if (cacheCart) {
        await CacheCartServices.setCacheCart(
          CacheCartServices.KEY_CART + newOrder.user_id,
          {
            _id: cacheCart._id.toString(),
            cart_userId: cacheCart.cart_userId.toString(),
            cart_status: cacheCart.cart_status,
            cart_count: 0,
            cart_total: 0,
          }
        );
      }

      return new CreatedResponse(201, newOrder).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  // [PATCH] AN ORDER
  updateOrder: async (req, res) => {
    const { order_id } = req.params;
    if (!order_id) {
      return new BadResquestError().send(res);
    }

    const data = req.body;

    try {
      const order = await OrderServices.updateOrder(order_id, data);
      if (!order) {
        return new NotFoundError(404, "Not found order").send(res);
      }

      return new CreatedResponse(201, order).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  updateOrderStatus: async (req, res) => {
    const { order_id } = req.params;
    if (!order_id) {
      return new BadResquestError().send(res);
    }

    const data = req.body;

    if (!data.status || !Object.keys(typeStatus).includes(data.status)) {
      return new BadResquestError(400, { message: "Invalid status" }).send(res);
    }

    try {
      const order = await OrderServices.getOrderByOrderID(order_id);
      if (!order) {
        return new NotFoundError(404, "Not found order").send(res);
      }

      const updated = await OrderServices.updateOrder(order_id, data);
      if (!updated) {
        return new BadResquestError(400, {
          message: "Updated order failed",
        }).send(res);
      }

      let mailContent;

      // send email for client if delivered
      if (data.status === typeStatus.delivered) {
        const link = `${process.env.CLIENT_ENDPOINT}/checkout/${order_id}`;

        mailContent = {
          to: order.user_infor.email,
          subject: "Antran shop thông báo:",
          template: templateEmail[data.status].template,
          context: {
            orderId: order.order_id,
            content: data.cancleContent,
            link,
          },
        };
      } else {
        mailContent = {
          to: order.user_infor.email,
          subject: "Antran shop thông báo:",
          template: templateEmail[data.status].template,
          context: {
            orderId: order.order_id,
            content: data.cancleContent,
          },
        };
      }

      handleSendMail(mailContent);

      const date = new Date(order.createdAt);

      if (data.status === typeStatus.delivered) {
        const grossDay = await GrossDateServices.getGrossInDay(
          date.toLocaleDateString("en-GB")
        );

        if (grossDay) {
          const queryGrossDate = {
            $inc: { gross: order.total, delivered_orders: 1 },
          };

          GrossDateServices.updateGross(grossDay._id, queryGrossDate);
        }

        const grossMonth = await GrossMonthServices.getGrossByMonth(
          date.getMonth() + 1,
          date.getFullYear()
        );

        if (grossMonth) {
          const queryGrossMonth = {
            $inc: { gross: order.total, delivered_orders: 1 },
          };

          GrossMonthServices.updateGross(grossMonth._id, queryGrossMonth);
        }

        const grossYear = await GrossYearServices.getGrossByYear(
          date.getFullYear()
        );

        if (grossYear) {
          const queryGrossMonth = {
            $inc: { gross: order.total, delivered_orders: 1 },
          };

          GrossYearServices.updateGross(grossYear._id, queryGrossMonth);
        }
      }

      if (data.status === typeStatus.cancle) {
        const grossDay = await GrossDateServices.getGrossInDay(
          date.toLocaleDateString("en-GB")
        );

        if (grossDay) {
          const queryGrossDate = {
            $inc: { cancle_orders: 1 },
          };

          GrossDateServices.updateGross(grossDay._id, queryGrossDate);
        }

        const grossMonth = await GrossMonthServices.getGrossByMonth(
          date.getMonth() + 1,
          date.getFullYear()
        );

        if (grossMonth) {
          const queryGrossMonth = {
            $inc: { cancle_orders: 1 },
          };

          GrossMonthServices.updateGross(grossMonth._id, queryGrossMonth);
        }

        const grossYear = await GrossYearServices.getGrossByYear(
          date.getFullYear()
        );

        if (grossYear) {
          const queryGrossMonth = {
            $inc: { cancle_orders: 1 },
          };

          GrossYearServices.updateGross(grossYear._id, queryGrossMonth);
        }
      }

      return new CreatedResponse(201, {
        message: "Updated order succesfully",
      }).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  updatePaymentStatus: async (req, res) => {
    const { order_id } = req.params;
    if (!order_id) {
      return new BadResquestError().send(res);
    }

    const data = req.body;
    if (!data.payment_status || !paymentStatus[data.payment_status]) {
      return new BadResquestError(400, "Invalid data").send(res);
    }

    try {
      const order = await OrderServices.getOrderByOrderID(order_id);
      if (!order) {
        return new NotFoundError(404, "Not found order").send(res);
      }

      const updated = await OrderServices.updateOrder(order_id, data);
      if (!updated) {
        return new BadResquestError(400, "Updated order failed").send(res);
      }

      // send email for admin if payment status success by VNPay - Card
      if (
        data.payment_status === paymentStatus.success &&
        order.payment_method !== paymentMethod.banking
      ) {
        const link = `${process.env.ADMIN_ENDPOINT}/orders/${order_id}`;
        let mailContent = {
          to: process.env.SHOP_EMAIL,
          subject: "Antran shop thông báo:",
          template: templateEmail.order.template,
          context: {
            link,
          },
        };

        const dataNotification = {
          content: "Đơn hàng mới",
          type: NotificationTypes.Order,
          path: `${ADMIN_NOTIFI_PATH.ORDER}/${order_id}`,
        };

        NotificationAdminServices.createNotification(dataNotification);

        handleSendMail(mailContent);
      }

      // update gross day - month - year if payment status success
      if (
        order.payment_method !== paymentMethod.banking &&
        data.payment_status === paymentStatus.success
      ) {
        const date = new Date(order.createdAt);

        // update for gross day
        let grossDay;

        const grossDayQuery = {
          $push: { orders: order._id },
          $inc: { sub_gross: order.total },
        };

        grossDay = await GrossDateServices.getGrossInDay(
          date.toLocaleDateString("en-GB")
        );

        if (!grossDay) {
          grossDay = await GrossDateServices.createGross(date);
        }

        GrossDateServices.updateGross(grossDay._id, grossDayQuery);

        // update for gross month
        let grossMonth;
        const grossMonthQuery = {
          $inc: { orders: 1, sub_gross: order.total },
        };

        grossMonth = await GrossMonthServices.getGrossByMonth(
          date.getMonth() + 1,
          date.getFullYear()
        );

        if (!grossMonth) {
          grossMonth = await GrossMonthServices.createGross(date);
        }
        GrossMonthServices.updateGross(grossMonth._id, grossMonthQuery);

        // update gross year
        let grossYear;
        const grossYearQuery = {
          $inc: { orders: 1, sub_gross: order.total },
        };

        grossYear = await GrossYearServices.getGrossByYear(date.getFullYear());

        if (!grossYear) {
          grossYear = await GrossYearServices.createGross(date);
        }

        GrossYearServices.updateGross(grossYear._id, grossYearQuery);
      }

      if (data.payment_status === paymentStatus.cancle) {
        for (let i = 0; i < order.items.length; i++) {
          const item = order.items[0];

          // restore count sold of product
          await ProductServices.updateProduct(
            item.product._id,
            {},
            {
              $inc: { sold: -item.quantity },
            }
          );

          // restore inventory of product
          await InventoryServices.updateInventory(
            item.product._id,
            {},
            {
              $inc: { inventory: item.quantity },
            }
          );

          if (item.variation) {
            // restore count sold of variation product
            await ProductServices.updateProduct(
              item.variation._id,
              {},
              {
                $inc: { sold: -item.quantity },
              }
            );

            // restore inventory of variation product
            await InventoryServices.updateInventory(
              item.variation._id,
              {},
              {
                $inc: { inventory: item.quantity },
              }
            );
          }
        }
      }

      if (order.payment_method !== paymentMethod.cod) {
        return res.redirect(
          `${process.env.CLIENT_ENDPOINT}/checkout/${order_id}`
        );
      }

      return new CreatedResponse(201, {
        message: "Updated payment status succesfully",
      }).send(res);
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  searchOrders: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE);
    const query = req.query;
    const { page, ...restQuery } = query;
    const currentPage = page ? Number(page) : 1;
    try {
      const totalItems = await OrderServices.searchOrders(restQuery);

      const orders = await OrderServices.searchOrdersWithPage(
        restQuery,
        PAGE_SIZE,
        currentPage
      );

      return new GetResponse(200, orders).send(res, {
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  searchOrdersForUser: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE);
    const query = req.query;
    const { user_id } = req.params;
    const { page, order_id, ...restQuery } = query;
    const currentPage = page ? Number(page) : 1;

    if (!user_id) {
      return new BadResquestError(400, "Invalid arguments").send(res);
    }

    let queryParse = { ...restQuery };

    if (order_id) {
      queryParse = {
        ...queryParse,
        order_id: { $regex: order_id, $options: "ui" },
      };
    }

    try {
      const totalItems = await OrderServices.searchOrdersForUser(
        user_id,
        queryParse
      );

      const orders = await OrderServices.searchOrdersForUserWithPage(
        user_id,
        PAGE_SIZE,
        currentPage,
        queryParse
      );

      return new GetResponse(200, orders).send(res, {
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
  // [DELETE] AN ORDER
  deleteOrder: async (req, res) => {
    const { order_id } = req.params;
    if (!order_id) {
      return new BadResquestError().send(res);
    }

    try {
      const order = await OrderServices.deleteOrder(order_id);
      if (!order) {
        return new NotFoundError(404, "Delete order failed").send(res);
      }

      return new CreatedResponse(201, {
        message: "Deleted order succesfully",
      }).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
    }
  },
  sendEmail: async (req, res) => {
    const data = req.body;
    const link = `${process.env.ADMIN_ENDPOINT}/orders/${data.id}`;

    const mailContent = {
      to: process.env.SHOP_EMAIL,
      subject: "Antrand shop thông báo:",
      template: templateEmail.order.template,
      context: {
        link,
      },
    };

    try {
      handleSendMail(mailContent);
      res.status(200).json({ message: "send email success" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = OrderController;

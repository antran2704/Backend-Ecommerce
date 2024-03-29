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
} = require("../../services");
const { GrossYearServices } = require("../../services/Gross");
const { Order } = require("../../models");
const { isValidObjectId } = require("mongoose");
const { NotificationTypes } = require("../../services/Notification");

const OrderController = {
  // [GET] ORDERS
  getOrders: async (req, res) => {
    const PAGE_SIZE = Number(process.env.PAGE_SIZE);
    const { page } = req.query;
    const currentPage = page ? Number(page) : 1;

    try {
      const totalItems = await OrderServices.getOrders();

      if (!totalItems) {
        return new NotFoundError(404, "Not found order").send(res);
      }

      const orders = await OrderServices.getOrdersWithPage(
        PAGE_SIZE,
        currentPage
      );

      if (!orders) {
        return new NotFoundError(404, "No order found!").send(res);
      }

      return new GetResponse(200, orders).send(res, {
        optionName: "pagination",
        data: {
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
    let query = {};

    if (!user_id || !isValidObjectId(user_id)) {
      return new BadResquestError().send(res);
    }

    // if (status) {
    //   query = { status };
    // }

    try {
      const totalItems = await OrderServices.getOrdersByUserId(user_id, data);

      if (!totalItems) {
        return new NotFoundError(404, "No order found!").send(res);
      }

      const orders = await OrderServices.getOrdersByUserIdWithPage(
        user_id,
        PAGE_SIZE,
        currentPage,
        data
      );

      if (!orders) {
        return new NotFoundError(404, "Not found order").send(res);
      }

      return new GetResponse(200, orders).send(res, {
        optionName: "pagination",
        data: {
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
      return new NotFoundError(404, "Not found order").send(res);
    }

    try {
      const order = await OrderServices.getOrder(order_id);
      if (!order) {
        return new NotFoundError(404, "Not found order").send(res);
      }

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
  createOrder: async (req, res, next) => {
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

    try {
      const cart = await CartServices.getCartByUserId(data.user_id);

      if (!cart || cart.cart_count === 0) {
        return new BadResquestError(400, "No item").send(res);
      }

      for (let i = 0; i < data.items.length; i++) {
        // const item = data.items[0];
        const item = data.items[i];

        if (item.variation) {
          const product = await ProductItemServices.getProductItemById(
            item.variation
          );

          if (!product) {
            return new BadResquestError().send(res);
          }

          if (product.inventory <= 0) {
            const link = `/products/${product.product_id}`;

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

          if (product.inventory <= 0) {
            const link = `${process.env.ADMIN_ENDPOINT}/products/${product._id}`;

            const dataNotification = {
              content: `${product.title} hết hàng`,
              type: NotificationTypes.Product,
              path: link,
            };

            NotificationAdminServices.createNotification(dataNotification);
          }
        }
      }

      const newOrder = await OrderServices.createOrder(data);
      if (!newOrder) {
        return new BadResquestError(400, "Create new order failed").send(res);
      }

      for (let i = 0; i < data.items.length; i++) {
        // const item = data.items[0];
        const item = data.items[i];
        const queryDB = {
          $inc: { inventory: -item.quantity, sold: item.quantity },
        };

        await ProductServices.updateProduct(item.product, {}, queryDB);

        if (item.variation) {
          await ProductItemServices.updateProductItem(
            item.variation,
            {},
            queryDB
          );
        }
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

      if (
        data.payment_status === paymentStatus.success &&
        order.payment_method !== paymentMethod.cod
      ) {
        const link = `${process.env.ADMIN_ENDPOINT}/orders/${order_id}`;
        let mailContent = {
          to: process.env.SHOP_EMAIL,
          subject: "Antran shop thông báo:",
          template: "email/newOrder",
          context: {
            link,
          },
        };

        const dataNotification = {
          content: "Đơn hàng mới",
          type: NotificationTypes.Order,
          path: `/orders/${order_id}`,
        };

        NotificationAdminServices.createNotification(dataNotification);

        handleSendMail(mailContent);

        const date = new Date();
        const grossDay = await GrossDateServices.getGrossInDay(
          date.toLocaleDateString("en-GB")
        );

        if (!grossDay) {
          const newGross = await GrossDateServices.createGross();

          if (!newGross) {
            return new BadResquestError(400, "Create new gross failed").send(
              res
            );
          }

          const query = {
            $push: { orders: order._id },
            $inc: { sub_gross: order.total },
          };

          GrossDateServices.updateGross(newGross._id, query);
        } else {
          const query = {
            $push: { orders: order._id },
            $inc: { sub_gross: order.total },
          };

          GrossDateServices.updateGross(grossDay._id, query);
        }

        const grossMonth = await GrossMonthServices.getGrossByMonth(
          date.getMonth() + 1,
          date.getFullYear()
        );

        if (!grossMonth) {
          const newGross = await GrossMonthServices.createGross();

          if (!newGross) {
            return new BadResquestError(400, "Create new gross failed").send(
              res
            );
          }

          const query = {
            $inc: { orders: 1, sub_gross: order.total },
          };

          GrossMonthServices.updateGross(newGross._id, query);
        } else {
          const query = {
            $inc: { orders: 1, sub_gross: order.total },
          };

          GrossMonthServices.updateGross(grossMonth._id, query);
        }

        const grossYear = await GrossYearServices.getGrossByYear(
          date.getFullYear()
        );

        if (!grossYear) {
          const newGross = await GrossYearServices.createGross();

          if (!newGross) {
            return new BadResquestError(400, "Create new gross failed").send(
              res
            );
          }

          const query = {
            $inc: { orders: 1, sub_gross: order.total },
          };

          GrossYearServices.updateGross(newGross._id, query);
        } else {
          const query = {
            $inc: { orders: 1, sub_gross: order.total },
          };

          GrossYearServices.updateGross(grossYear._id, query);
        }
      }

      if (data.payment_status === paymentStatus.cancle) {
        for (let i = 0; i < order.items.length; i++) {
          const item = order.items[0];
          const queryDB = {
            $inc: { inventory: item.quantity, sold: -item.quantity },
          };

          await ProductServices.updateProduct(item.product._id, {}, queryDB);

          if (item.variation) {
            await ProductItemServices.updateProductItem(
              item.variation._id,
              {},
              queryDB
            );
          }
        }
      }

      if (
        data.payment_status === paymentStatus.success ||
        data.payment_status === paymentStatus.cancle
      ) {
        const cart = await CartServices.getCartByUserId(order.user_id);

        if (!cart) {
          return new BadResquestError(400, "Not found cart").send(res);
        }

        CartServices.deleteAllItemCart(cart._id);
        CartServices.updateCart(order.user_id, {
          cart_count: 0,
          cart_total: 0,
        });

        if (order.payment_method !== paymentMethod.cod) {
          return res.redirect(
            `${process.env.CLIENT_ENDPOINT}/checkout/${order_id}`
          );
        }
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
        optionName: "pagination",
        data: {
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
      template: "email/newOrder",
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

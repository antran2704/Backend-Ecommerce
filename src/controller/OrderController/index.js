const { typeStatus, templateEmail } = require("./status");
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
const { OrderServices, GrossDayServices } = require("../../services");

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
    if (!user_id) {
      return new BadResquestError().send(res);
    }
    try {
      const totalItems = await OrderServices.getOrdersByUserId(user_id);

      if (!totalItems) {
        return new NotFoundError(404, "No order found!").send(res);
      }

      const orders = await OrderServices.getOrdersByUserIdWithPage(
        user_id,
        PAGE_SIZE,
        currentPage
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
  // [POST] AN ORDER
  createOrder: async (req, res) => {
    const data = req.body;

    if (!data) {
      return new BadResquestError().send(res);
    }

    try {
      const newOrder = await OrderServices.createOrder(data);
      if (!newOrder) {
        return new BadResquestError(400, "Create new order failed").send(res);
      }

      const link = `${process.env.HOST_URL}/orders/${newOrder._id}`;
      let mailContent = {
        to: "phamtrangiaan27@gmail.com",
        subject: "Antran shop thông báo:",
        template: "email/newOrder",
        context: {
          link,
        },
      };

      handleSendMail(mailContent);

      const date = new Date().toLocaleDateString("en-GB");
      const grossDay = await GrossDayServices.getGrossInDay(date);

      if (!grossDay) {
        const newGross = await GrossDayServices.createGross();

        if (!newGross) {
          return new BadResquestError(400, "Create new gross failed").send(res);
        }

        if (data.payment_method === "card") {
          const query = {
            $push: { orders: newOrder._id },
            $inc: { gross: newOrder.total },
          };

          GrossDayServices.updateGross(newGross._id, query);
        } else {
          const query = {
            $push: { orders: newOrder._id },
          };

          GrossDayServices.updateGross(newGross._id, query);
        }
      } else {
        if (data.payment_method === "card") {
          const query = {
            $push: { orders: newOrder._id },
            $inc: { gross: newOrder.total },
          };

          GrossDayServices.updateGross(grossDay._id, query);
        } else {
          const query = {
            $push: { orders: newOrder._id },
          };

          GrossDayServices.updateGross(grossDay._id, query);
        }
      }

      return new CreatedResponse(201, newOrder).send(res);
    } catch (error) {
      return new InternalServerError().send(res);
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
  updateStatusOrder: async (req, res) => {
    const { order_id } = req.params;
    if (!order_id) {
      return new BadResquestError().send(res);
    }

    const data = req.body;

    if (!data.status || !Object.keys(typeStatus).includes(data.status)) {
      return new BadResquestError(400, { message: "Invalid status" }).send(res);
    }

    try {
      const order = await OrderServices.getOrder(order_id);
      if (!order) {
        return new NotFoundError(404, "Not found order").send(res);
      }

      const updated = await OrderServices.updateOrder(order_id, data);
      if (!updated) {
        return new BadResquestError(400, {
          message: "Updated order failed",
        }).send(res);
      }

      let mailContent = {
        to: order.user_infor.email,
        subject: "Antran shop thông báo:",
        template: templateEmail[data.status].template,
        context: {
          orderId: order.order_id,
          content: data.cancleContent,
        },
      };

      handleSendMail(mailContent);

      if (data.status === typeStatus.delivered && order.payment_method !== "card") {
        const date = new Date(order.createdAt).toLocaleDateString("en-GB");
        const grossDay = await GrossDayServices.getGrossInDay(date);

        if (!grossDay) {
          const newGross = await GrossDayServices.createGross();

          if (!newGross) {
            return new BadResquestError(400, "Create new gross failed").send(
              res
            );
          }

          const query = {
            $push: { orders: newOrder._id },
            $inc: { gross: newOrder.total },
          };

          GrossDayServices.updateGross(newGross._id, query);
        } else {
          const query = {
            $push: { orders: newOrder._id },
            $inc: { gross: newOrder.total },
          };

          GrossDayServices.updateGross(grossDay._id, query);
        }
      }

      return new CreatedResponse(201, {
        message: "Updated order succesfully",
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
    const link = `${process.env.HOST_URL}/orders/${data.id}`;

    const mailContent = {
      to: "phamtrangiaan27@gmail.com",
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

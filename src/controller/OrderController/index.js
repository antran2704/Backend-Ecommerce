const { typeStatus, templateEmail } = require("./status");
const handleSendMail = require("../../configs/mailServices");
const { getDateTime } = require("../../helpers/getDateTime");
const { Order } = require("../../models/index");

const PAGE_SIZE = Number(process.env.PAGE_SIZE);

const OrderController = {
  // [GET] All ORDER
  getAllOrders: async (req, res) => {
    const query = req.query;
    const currentPage = query.page ? Number(query.page) : 1;

    try {
      const totalItems = await Order.find({});
      const orders = await Order.find({})
        .skip((currentPage - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .sort({ createdAt: -1 });

      res.status(200).json({
        status: 200,
        payload: orders,
        pagination: {
          totalItems: totalItems.length,
          currentPage,
          pageSize: PAGE_SIZE,
        },
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [GET] AN ORDER
  getAnOrder: async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findById({ _id: id }).populate(
        "items.product",
        { _id: 1, title: 1 }
      );
      if (!order) {
        return res.status(404).json({
          status: 404,
          message: "Order not exit",
        });
      }
      res.status(200).json({
        status: 200,
        payload: order,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [POST] AN ORDER
  addOrder: async (req, res) => {
    const data = req.body;
    try {
      const newOrder = await new Order(data);
      await newOrder.save();

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

      res.status(200).json({
        status: 200,
        message: "Add new order succesfully",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [PATCH] AN ORDER
  changeOrder: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const date = getDateTime();
    try {
      const order = await Order.findById({ _id: id });
      if (!order) {
        return res.status(404).json({
          status: 404,
          message: "Order not exit",
        });
      }
      await order.updateOne({ ...data, updatedAt: date });
      res.status(200).json({
        status: 200,
        message: "Updated order succesfully",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  changeStatusOrder: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const date = getDateTime();

    if (!data.status || !Object.keys(typeStatus).includes(data.status)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid status",
      });
    }

    try {
      const order = await Order.findOne({ _id: id });
      console.log(order)
      if (!order) {
        return res.status(404).json({
          status: 404,
          message: "Order not exit",
        });
      }

      let mailContent = {
        to: order.email,
        subject: "Antran shop thông báo:",
        template: templateEmail[data.status].template,
        context: {
          orderId: id,
          content: data.cancleContent,
        },
      };

      await order.updateOne({ ...data, updatedAt: date });
      handleSendMail(mailContent);

      res.status(200).json({
        status: 200,
        message: "Updated order succesfully",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  searchOrders: async (req, res) => {
    const query = req.query;
    const searchText = query.search;
    const currentPage = query.page ? Number(query.page) : 1;
    try {
      const totalItems = await Order.find({
        $or: [
          {
            name: { $regex: searchText, $options: "i" },
          },
          {
            email: { $regex: searchText, $options: "i" },
          },
          {
            phoneNumber: { $regex: searchText, $options: "i" },
          },
        ],
      });

      const orders = await Order.find({
        $or: [
          {
            name: { $regex: searchText, $options: "i" },
          },
          {
            email: { $regex: searchText, $options: "i" },
          },
          {
            phoneNumber: { $regex: searchText, $options: "i" },
          },
        ],
      })
        .skip((currentPage - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .sort({ createdAt: -1 });

      return res.status(200).json({
        status: 200,
        payload: orders,
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
  // [DELETE] AN ORDER
  deleteOrder: async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findById({ _id: id });
      if (!order) {
        res.status(404).json({
          status: 404,
          message: "Order not exit",
        });
        return;
      }
      await order.remove();
      res.status(200).json({
        status: 200,
        message: "Deleted order succesfully",
      });
    } catch (error) {
      res.status(500).json(error);
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

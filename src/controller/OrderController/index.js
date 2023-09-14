const { typeStatus, templateEmail } = require("./status");
const handleSendMail = require("../../configs/mailServices");
const { getDateTime } = require("../../helpers/getDateTime");
const { Order } = require("../../models/index");

const OrderController = {
  // [GET] All ORDER
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find({});
      res.status(200).json({
        status: 200,
        payload: orders,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [GET] AN ORDER
  getAnOrder: async (req, res) => {
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
    let mailContent = {
      to: "phamtrangiaan27@gmail.com",
      subject: "Antran shop thông báo:",
      template: "email/newOrder",
    };

    try {
      const data = req.body;
      const newOrder = await new Order(data);
      await newOrder.save();
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
        res.status(404).json({
          status: 404,
          message: "Order not exit",
        });
        return;
      }
      await order.update({ ...data, updatedAt: date });
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
    const { status } = req.body;
    const date = getDateTime();

    if (!status || !typeStatus.includes(status)) {
      res.status(400).json({
        status: 400,
        message: "Invalid status",
      });
    }

    try {
      const order = await Order.findById({ _id: id });
      if (!order) {
        res.status(404).json({
          status: 404,
          message: "Order not exit",
        });
        return;
      }

      let mailContent = {
        to: order.email,
        subject: "Antran shop thông báo:",
        template: templateEmail[status].template,
      };

      await order.updateOne({ status, updatedAt: date });
      handleSendMail(mailContent);

      res.status(200).json({
        status: 200,
        message: "Updated order succesfully",
      });
    } catch (error) {
      res.status(500).json(error);
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
    const mailContent = {
      to: "phamtrangiaan27@gmail.com",
      subject: "Antrand shop thông báo:",
      template: "email/cancleEmail",
    };

    try {
      handleSendMail(mailContent);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = OrderController;

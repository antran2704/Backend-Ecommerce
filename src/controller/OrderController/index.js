const { getDateTime } = require("../../helpers/getDateTime");
const { readHTMLFile, createHTML } = require("../../helpers/nodemailer");
const { Order } = require("../../models/index");
const path = require("path");

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
    try {
      const data = req.body;
      const newOrder = await new Order(data);
      newOrder.save();
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

    if (!status || status !== "success" || status !== "cancle") {
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
      await order.update({ status, updatedAt: date });
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
      subject: "Antrandev blog thông báo:",
      text: "Bạn đang đang đăng ký thành viên tại Antrandev blog , vui lòng nhấn link dưới đây để hoàn tất đăng ký",
      template: "email/cancleEmail",
    };

    try {
      const pathName = path.resolve(__dirname, "../../views/email/index.hbs");
      readHTMLFile(pathName, createHTML.email, mailContent);

      return res.status(200).json({
        status: 200,
        message: "succesfully",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = OrderController;

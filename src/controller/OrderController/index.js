const { Order } = require("../../models/index");

const OrderController = {
  // [GET] All ORDER
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find({});
      res.status(200).json({
        status: 200,
        payload: orders
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [GET] AN ORDER
  getAnOrder: async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findById({_id: id});
      if(!order) {
        res.status(404).json({
          status: 404,
          message: "Order not exit",
        });
        return;
      }
      res.status(200).json({
        status: 200,
        payload: order
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
        message: "Add new order succesfully"
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [PATCH] AN ORDER
  changeOrder: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
      const order = await Order.findById({ _id: id });
      if (!order) {
        res.status(404).json({
          status: 404,
          message: "Order not exit",
        });
        return;
      }
      await order.update(data);
      res.status(200).json({
        status: 200,
        message: "Updated order succesfully"
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
        message: "Deleted order succesfully"
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = OrderController;

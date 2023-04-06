const { Order } = require("../../models/index");

const OrderController = {
  // [GET] All ORDER
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find({});
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [GET] A ORDER
  getACategory: async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findById({_id: id});
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [POST] A ORDER
  addOrder: async (req, res) => {
    try {
      const data = req.body;
      const newOrder = await new Order(data);
      newOrder.save();
      res.status(200).json("Add new order succesfully");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [PATCH] A ORDER
  changeOrder: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
      const order = await Order.findById({ _id: id });
      if (!order) {
        res.status(404).json("Order not exit");
        return;
      }
      await order.update(data);
      res.status(200).json("Updated order succesfully");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // [DELETE] A ORDER
  deleteOrder: async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findById({ _id: id });
      if (!order) {
        res.status(404).json("Order not exit");
        return;
      }
      await order.remove();
      res.status(200).json("Deleted order succesfully");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = OrderController;

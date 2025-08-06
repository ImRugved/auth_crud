const Order = require('../models/orderModel');
const path = require('path');

class OrderController {
  static async createOrder(req, res) {
    try {
      const { order_name, city, address, amount, date } = req.body;
      const user_id = req.user.id;
      let image = null;
      if (req.file) {
        image = req.file.filename;
      }
      const result = await Order.create({ user_id, order_name, city, address, amount, date, image });
      res.status(201).json({ message: 'Order created successfully', order_id: result.insertId });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getOrders(req, res) {
    try {
      const user_id = req.user.id;
      const orders = await Order.getByUser(user_id);
      // Exclude user_id from each order object
      const ordersWithoutUserId = orders.map(({ user_id, ...rest }) => rest);
      res.json(ordersWithoutUserId);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = OrderController;
const db = require('../config/database');

class Order {
  static async create(orderData) {
    const [result] = await db.execute(
      'INSERT INTO orders (user_id, order_name, city, address, amount, date, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [orderData.user_id, orderData.order_name, orderData.city, orderData.address, orderData.amount, orderData.date, orderData.image]
    );
    return result;
  }

  static async getByUser(user_id) {
    const [rows] = await db.execute('SELECT * FROM orders WHERE user_id = ?', [user_id]);
    return rows;
  }
}

module.exports = Order;
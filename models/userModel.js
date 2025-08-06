const db = require('../config/database');

class User {
  static async create(userData) {
    const [result] = await db.execute(
      'INSERT INTO users (first_name, last_name, mobile_no, email, state, city, address, password, otp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userData.first_name, userData.last_name, userData.mobile_no, userData.email, userData.state, userData.city, userData.address, userData.password, userData.otp]
    );
    return result;
  }

  static async findByMobile(mobile_no) {
    const [rows] = await db.execute('SELECT * FROM users WHERE mobile_no = ?', [mobile_no]);
    return rows[0];
  }

  static async updatePassword(mobile_no, password) {
    const [result] = await db.execute(
      'UPDATE users SET password = ? WHERE mobile_no = ?',
      [password, mobile_no]
    );
    return result;
  }

  static async updateOtp(mobile_no, otp) {
    const [result] = await db.execute(
      'UPDATE users SET otp = ? WHERE mobile_no = ?',
      [otp, mobile_no]
    );
    return result;
  }

  static async updateToken(userId, token) {
    const [result] = await db.execute(
      'UPDATE users SET token = ? WHERE id = ?',
      [token, userId]
    );
    return result;
  }

  static async findById(userId) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    return rows[0];
  }
}

module.exports = User;
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).promise();

// Function to create tables if they don't exist
async function initializeDatabase() {
  try {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        mobile_no VARCHAR(15) UNIQUE NOT NULL,
        email VARCHAR(100) NOT NULL,
        state VARCHAR(50) NOT NULL,
        city VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        password VARCHAR(255) NOT NULL,
        otp VARCHAR(6),
        token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    const createOrdersTable = `
      CREATE TABLE IF NOT EXISTS orders (
        order_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        order_name VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        address VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        date DATE NOT NULL,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;
    await pool.query(createUsersTable);
    await pool.query(createOrdersTable);
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
}

// Initialize tables when the application starts
initializeDatabase();

module.exports = pool;
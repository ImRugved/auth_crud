const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../doc/images'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post('/', authenticateToken, upload.single('image'), OrderController.createOrder);
router.get('/', authenticateToken, OrderController.getOrders);

module.exports = router;
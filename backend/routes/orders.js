const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  verifyKhaltiPaymentHandler,
  updateOrderToPaid
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, admin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.post('/:id/pay/khalti', protect, verifyKhaltiPaymentHandler);
router.put('/:id/pay', protect, admin, updateOrderToPaid);

module.exports = router;
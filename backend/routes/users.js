const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  addToWishlist,
  removeFromWishlist,
  getAllUsers,
  deleteUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);
router.get('/cart', protect, getCart);
router.post('/cart', protect, addToCart);
router.put('/cart/:productId', protect, updateCartItem);
router.delete('/cart/:productId', protect, removeFromCart);
router.post('/wishlist/:productId', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

module.exports = router;
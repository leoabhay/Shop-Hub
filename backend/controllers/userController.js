const User = require('../models/User');

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user.id);

    const existingItem = user.cart.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      user.cart.push({ product: productId, quantity: quantity || 1 });
    }

    await user.save();
    await user.populate('cart.product');

    res.json({
      message: 'Product added to cart',
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart item
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user.id);

    const cartItem = user.cart.find(
      item => item.product.toString() === req.params.productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cartItem.quantity = quantity;
    await user.save();
    await user.populate('cart.product');

    res.json({
      message: 'Cart updated',
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.cart = user.cart.filter(
      item => item.product.toString() !== req.params.productId
    );

    await user.save();
    await user.populate('cart.product');

    res.json({
      message: 'Item removed from cart',
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.wishlist.includes(req.params.productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    user.wishlist.push(req.params.productId);
    await user.save();
    await user.populate('wishlist');

    res.json({
      message: 'Product added to wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.wishlist = user.wishlist.filter(
      id => id.toString() !== req.params.productId
    );

    await user.save();
    await user.populate('wishlist');

    res.json({
      message: 'Product removed from wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
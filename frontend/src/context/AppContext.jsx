import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [viewingItemId, setViewingItemId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    setCurrentPage('products');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      loadUserData();
    }
    loadProducts();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      // Load cart
      const cartRes = await fetch(`${import.meta.env.VITE_API_URL}/users/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const cartData = await cartRes.json();
      setCart(cartData.cart || []);

      // Load full user profile
      const userRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await userRes.json();
      if (userRes.ok && userData.user) {
        setUser(userData.user);
        localStorage.setItem('user', JSON.stringify(userData.user));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadProducts = async (keyword = '') => {
    try {
      const url = keyword 
        ? `${import.meta.env.VITE_API_URL}/products?keyword=${encodeURIComponent(keyword)}`
        : `${import.meta.env.VITE_API_URL}/products`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    loadUserData();
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const addToCart = (product) => {
    if (!user) {
      setCurrentPage('login');
      showNotification('Please login to add items to cart', 'error');
      return;
    }
    const existing = cart.find(item => item.product._id === product._id);
    if (existing) {
      setCart(cart.map(item => 
        item.product._id === product._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    showNotification('Added to cart!');
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product._id !== productId));
    showNotification('Removed from cart');
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.product._id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      const { name, phone, street, city, state, zipCode, country, gender } = profileData;
      const formattedData = {
        name,
        phone,
        gender,
        address: { street, city, state, zipCode, country }
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        showNotification(data.message || 'Error updating profile', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('Error updating profile', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      user, cart, wishlist, products, notification, currentPage,
      login, logout, addToCart, removeFromCart, updateCartQuantity,
      showNotification, loadProducts, setCurrentPage, updateProfile,
      viewingItemId, setViewingItemId, setCart,
      selectedCategory, setSelectedCategory, filterByCategory
    }}>
      {children}
    </AppContext.Provider>
  );
};
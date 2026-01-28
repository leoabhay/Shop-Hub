import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, BarChart3, Users, Package, Edit, Trash2, 
  CheckCircle, User, X, Plus, Settings, CreditCard, 
  LineChart, PieChart, Activity, ShieldCheck, Mail, Phone, MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const AdminDashboard = () => {
  const { products, user, showNotification, loadProducts, updateProfile } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0
  });
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: 'Electronics',
    stock: '',
    brand: '',
    featured: false
  });
  const [productImages, setProductImages] = useState([]);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'Nepal'
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || 'Nepal'
      });
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Load products first
      await loadProducts();

      // Load orders
      const ordersRes = await fetch('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!ordersRes.ok) {
        throw new Error('Failed to load orders');
      }
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders || []);

      // Load users
      const usersRes = await fetch('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!usersRes.ok) {
        throw new Error('Failed to load users');
      }
      const usersData = await usersRes.json();
      setUsers(usersData.users || []);

      // Calculate stats
      const totalRevenue = (ordersData.orders || []).reduce((sum, order) => sum + order.totalPrice, 0);
      const avgOrderValue = ordersData.orders?.length > 0 ? totalRevenue / ordersData.orders.length : 0;
      
      setStats({
        totalOrders: ordersData.total || ordersData.orders?.length || 0,
        totalRevenue,
        totalUsers: usersData.users?.length || 0,
        totalProducts: products.length,
        avgOrderValue,
        conversionRate: 2.5, // Dummy static data
        growth: 12.5 // Dummy static data
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showNotification('Failed to load dashboard data', 'error');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    const success = await updateProfile(profileForm);
    setIsUpdatingProfile(false);
    if (success) {
      showNotification('Profile updated successfully');
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboardData();
    }
  }, [user]);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        showNotification('Product deleted successfully');
        loadProducts();
        loadDashboardData();
      } else {
        showNotification('Failed to delete product', 'error');
      }
    } catch (error) {
      showNotification('Error deleting product', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        showNotification('User deleted successfully');
        loadDashboardData();
      } else {
        const data = await res.json();
        showNotification(data.message || 'Failed to delete user', 'error');
      }
    } catch (error) {
      showNotification('Error deleting user', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        showNotification('Order status updated');
        loadDashboardData();
      } else {
        showNotification('Failed to update order status', 'error');
      }
    } catch (error) {
      showNotification('Error updating order status', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        showNotification('Order deleted successfully');
        loadDashboardData();
      } else {
        showNotification('Failed to delete order', 'error');
      }
    } catch (error) {
      showNotification('Error deleting order', error);
    }
  };

  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice || '',
        category: product.category,
        stock: product.stock,
        brand: product.brand || '',
        featured: product.featured
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        category: 'Electronics',
        stock: '',
        brand: '',
        featured: false
      });
    }
    setProductImages([]);
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      Object.keys(productForm).forEach(key => {
        formData.append(key, productForm[key]);
      });
      
      if (productImages.length > 0) {
        productImages.forEach(image => {
          formData.append('images', image);
        });
      }
      
      const url = editingProduct 
        ? `http://localhost:5000/api/products/${editingProduct._id}`
        : 'http://localhost:5000/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      if (res.ok) {
        showNotification(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        setShowProductModal(false);
        loadProducts();
        loadDashboardData();
      } else {
        const data = await res.json();
        showNotification(data.message || 'Failed to save product', 'error');
      }
    } catch (error) {
      showNotification('Error saving product', error);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <GlassCard className="p-16">
          <h2 className="text-3xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-white/70">You don't have permission to view this page.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShoppingBag className="w-16 h-16 text-purple-400" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60 font-medium">Total Orders</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.totalOrders}</p>
          <p className="text-xs text-green-400 flex items-center gap-1">
            <LineChart className="w-3 h-3" /> +{stats.growth}% from last month
          </p>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BarChart3 className="w-16 h-16 text-pink-400" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60 font-medium">Revenue</span>
            <CreditCard className="w-4 h-4 text-pink-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">Rs. {stats.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-white/50">Avg. Order: Rs. {Math.round(stats.avgOrderValue)}</p>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-blue-400" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60 font-medium">Total Users</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.totalUsers}</p>
          <p className="text-xs text-blue-400">Active now: {Math.round(stats.totalUsers * 0.1)}</p>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Package className="w-16 h-16 text-green-400" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60 font-medium">Total Products</span>
            <PieChart className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.totalProducts}</p>
          <p className="text-xs text-green-400">{products.filter(p => p.stock < 10).length} items low stock</p>
        </GlassCard>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'overview', icon: Activity, label: 'Overview' },
          { id: 'products', icon: Package, label: 'Products' },
          { id: 'orders', icon: ShoppingBag, label: 'Orders' },
          { id: 'users', icon: Users, label: 'Users' },
          { id: 'profile', icon: User, label: 'My Profile' },
          { id: 'settings', icon: Settings, label: 'Settings' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <GlassCard className="p-6">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-white font-semibold">Order #{order._id.slice(-6)}</p>
                      <p className="text-white/60 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-pink-400 font-bold">Rs. {order.totalPrice.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                      order.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Inventory Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-6 bg-white/5 border border-white/10">
                   <h3 className="text-lg font-semibold text-white mb-4">Top Categories</h3>
                   <div className="space-y-4">
                     {['Electronics', 'Clothing', 'Books', 'Home & Garden'].map(cat => {
                       const count = products.filter(p => p.category === cat).length;
                       const percentage = products.length > 0 ? (count / products.length) * 100 : 0;
                       return (
                         <div key={cat} className="space-y-1">
                           <div className="flex justify-between text-sm">
                             <span className="text-white/70">{cat}</span>
                             <span className="text-white font-medium">{count} items</span>
                           </div>
                           <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                               style={{ width: `${percentage}%` }}
                             ></div>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                </GlassCard>

                <GlassCard className="p-6 bg-white/5 border border-white/10">
                   <h3 className="text-lg font-semibold text-white mb-4">Stock Alerts</h3>
                   <div className="space-y-4">
                     {products.filter(p => p.stock < 10 && p.stock > 0).slice(0, 4).map(product => (
                       <div key={product._id} className="flex items-center justify-between p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center overflow-hidden">
                              {product.images?.[0] ? (
                                <img src={product.images[0].startsWith('data:') ? product.images[0] : `http://localhost:5000${product.images[0]}`} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-5 h-5 text-red-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium line-clamp-1">{product.name}</p>
                              <p className="text-red-400 text-xs">{product.stock} left</p>
                            </div>
                         </div>
                         <Button 
                            variant="secondary" 
                            className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20"
                            onClick={() => openProductModal(product)}
                          >
                            Edit
                          </Button>
                       </div>
                     ))}
                     {products.filter(p => p.stock < 10 && p.stock > 0).length === 0 && (
                       <div className="text-center py-8">
                         <ShieldCheck className="w-12 h-12 text-green-400 mx-auto mb-2 opacity-30" />
                         <p className="text-white/50 text-sm">Stock levels are healthy</p>
                       </div>
                     )}
                   </div>
                </GlassCard>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Manage Products</h2>
              <Button onClick={() => openProductModal()}>
                <Plus className="w-4 h-4 mr-2 inline" />
                Add Product
              </Button>
            </div>
            <div className="space-y-4">
              {products.map(product => (
                <div key={product._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                      {product.images && product.images[0] ? (
                        <img 
                          src={product.images[0].startsWith('data:') ? product.images[0] : `http://localhost:5000${product.images[0]}`} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <Package className="w-8 h-8 text-white/30" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{product.name}</p>
                      <p className="text-white/60 text-sm">{product.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-pink-400 font-bold">Rs. {product.price}</span>
                    <span className="text-white/60">Stock: {product.stock}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openProductModal(product)}
                        className="p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30"
                      >
                        <Edit className="w-4 h-4 text-blue-400" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">All Orders</h2>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="p-4 bg-white/5 rounded-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-white font-semibold">Order #{order._id.slice(-6)}</p>
                      <p className="text-white/60 text-sm">
                        Customer: {order.user?.name || 'Unknown'}
                      </p>
                      <p className="text-white/60 text-sm">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      className="px-3 py-1 rounded-full text-sm bg-white/10 text-white border border-white/20 focus:outline-none focus:border-pink-400"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">{order.orderItems?.length || 0} items</span>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-pink-400 font-bold">Rs. {order.totalPrice.toFixed(2)}</p>
                        <p className="text-white/60 text-sm">{order.paymentMethod}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteOrder(order._id)}
                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map(u => (
                <div key={u._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{u.name}</p>
                      <p className="text-white/60 text-xs flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {u.email}
                      </p>
                      <p className="text-pink-400 text-[10px] font-bold mt-1 uppercase tracking-wider">
                        Spent: Rs. {orders.filter(o => o.user?._id === u._id).reduce((s,o) => s+o.totalPrice, 0).toFixed(0)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      u.role === 'admin' 
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {u.role}
                    </span>
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8">Update Profile</h2>
            <div className="flex flex-col items-center mb-10">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4 shadow-2xl shadow-purple-500/30">
                {user?.name?.charAt(0)}
              </div>
              <p className="text-white text-xl font-bold">{user?.name}</p>
              <p className="text-white/60">{user?.email}</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 block ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 block ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-all"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-white/70 block ml-1">Shipping Address</label>
                
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={profileForm.street}
                    onChange={(e) => setProfileForm({ ...profileForm, street: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-all"
                    placeholder="Street Address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-all"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-all"
                    placeholder="State / Province"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={profileForm.zipCode}
                    onChange={(e) => setProfileForm({ ...profileForm, zipCode: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-all"
                    placeholder="ZIP Code"
                  />
                  <input
                    type="text"
                    value={profileForm.country}
                    onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-all"
                    placeholder="Country"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full py-4 text-lg mt-4 shadow-xl shadow-pink-500/20"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? 'Updating...' : 'Save Changes'}
              </Button>
            </form>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-8">System Settings</h2>
            <div className="space-y-6">
              {[
                { label: 'Push Notifications', desc: 'Receive alerts for new orders', icon: Activity },
                { label: 'Email Reports', desc: 'Get daily sales summaries via email', icon: Mail },
                { label: 'Two-Factor Authentication', desc: 'Enable extra security for your account', icon: ShieldCheck }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-xl">
                      <item.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{item.label}</p>
                      <p className="text-white/50 text-sm">{item.desc}</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-pink-500/20 border border-pink-500/30 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-pink-500 rounded-full"></div>
                  </div>
                </div>
              ))}
              
              <div className="pt-8 border-t border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Maintenance</h3>
                <Button variant="danger" className="w-full sm:w-auto bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20">
                   Clear System Cache
                </Button>
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <GlassCard className="p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowProductModal(false)} className="text-white/70 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-pink-400"
                required
              />

              <textarea
                placeholder="Description"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-pink-400 min-h-[100px]"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Price"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-pink-400"
                  required
                />

                <input
                  type="number"
                  placeholder="Discount Price (Optional)"
                  value={productForm.discountPrice}
                  onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-pink-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-pink-400"
                  required
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Sports">Sports</option>
                  <option value="Toys">Toys</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Food">Food</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="number"
                  placeholder="Stock"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-pink-400"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Brand (Optional)"
                value={productForm.brand}
                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-pink-400"
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  className="w-5 h-5"
                />
                <label htmlFor="featured" className="text-white">Mark as Featured Product</label>
              </div>

              <div>
                <label className="block text-white mb-2">Product Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setProductImages(Array.from(e.target.files))}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-pink-500 file:text-white hover:file:bg-pink-600"
                />
                <p className="text-white/60 text-sm mt-2">You can upload up to 5 images</p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowProductModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

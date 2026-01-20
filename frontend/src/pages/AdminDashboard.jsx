import React, { useState } from 'react';
import { ShoppingBag, BarChart3, Users, Package, Edit, Trash2, CheckCircle, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const AdminDashboard = () => {
  const { products, user } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats] = useState({
    totalOrders: 145,
    totalRevenue: 125000,
    totalUsers: 89,
    totalProducts: products.length
  });

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <ShoppingBag className="w-8 h-8 text-purple-400" />
            <span className="text-sm text-white/60">Total Orders</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-pink-400" />
            <span className="text-sm text-white/60">Revenue</span>
          </div>
          <p className="text-3xl font-bold text-white">Rs. {stats.totalRevenue.toLocaleString()}</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-400" />
            <span className="text-sm text-white/60">Total Users</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-green-400" />
            <span className="text-sm text-white/60">Products</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
        </GlassCard>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {['overview', 'products', 'orders', 'users'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <GlassCard className="p-6">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-white font-semibold">Order #{1000 + i} completed</p>
                      <p className="text-white/60 text-sm">2 hours ago</p>
                    </div>
                  </div>
                  <span className="text-pink-400 font-bold">Rs. 5,000</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Manage Products</h2>
              <Button>Add New Product</Button>
            </div>
            <div className="space-y-4">
              {products.slice(0, 10).map(product => (
                <div key={product._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-white/30" />
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
                      <button className="p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30">
                        <Edit className="w-4 h-4 text-blue-400" />
                      </button>
                      <button className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30">
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
            <h2 className="text-2xl font-bold text-white mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="p-4 bg-white/5 rounded-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-white font-semibold">Order #{1000 + i}</p>
                      <p className="text-white/60 text-sm">Customer: John Doe</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      i % 3 === 0 ? 'bg-green-500/20 text-green-400' :
                      i % 3 === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {i % 3 === 0 ? 'Delivered' : i % 3 === 1 ? 'Processing' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">3 items</span>
                    <span className="text-pink-400 font-bold">Rs. {(Math.random() * 10000 + 1000).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">User {i}</p>
                      <p className="text-white/60 text-sm">user{i}@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                      {i === 1 ? 'Admin' : 'User'}
                    </span>
                    <button className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default AdminDashboard;
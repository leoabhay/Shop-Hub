import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, ShieldCheck, Activity, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const ProfilePage = () => {
  const { user, updateProfile, showNotification } = useApp();
  const [isUpdating, setIsUpdating] = useState(false);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'Nepal',
    gender: user?.gender || 'Not Specified'
  });

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || 'Nepal',
        gender: user.gender || 'Not Specified'
      });
      fetchOrders();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const success = await updateProfile(formData);
    setIsUpdating(false);
    if (success) {
      showNotification('Profile updated successfully!');
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <GlassCard className="p-16">
          <h2 className="text-3xl font-bold text-white mb-4">Please Login</h2>
          <p className="text-white/70">You need to be logged in to view your profile.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - User Info */}
        <div className="lg:col-span-1">
          <GlassCard className="p-8 text-center sticky top-24">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-5xl font-bold mx-auto mb-6 shadow-2xl shadow-purple-500/30">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
            <p className="text-white/60 mb-6">{user.email}</p>
            <div className="inline-block px-4 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium border border-purple-500/30">
              {user.role === 'admin' ? 'Administrator' : 'Verified Member'}
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
               <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Joined</span>
                  <span className="text-white">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                  </span>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Total Orders</span>
                  <span className="text-white font-bold">{orders.length}</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Total Spent</span>
                  <span className="text-pink-400 font-bold">
                    Rs. {orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
                  </span>
               </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column - Update Form */}
        <div className="lg:col-span-2">
          <GlassCard className="p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-8">Personal Information</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-all"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70 ml-1">Gender Identity</label>
                    <div className="relative group">
                      <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400 group-focus-within:text-pink-300 transition-colors z-10" />
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full pl-12 pr-10 py-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 text-white focus:outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all appearance-none cursor-pointer hover:bg-white/15"
                      >
                        <option value="Not Specified" className="bg-slate-900">Not Specified</option>
                        <option value="Male" className="bg-slate-900">Male</option>
                        <option value="Female" className="bg-slate-900">Female</option>
                        <option value="Other" className="bg-slate-900">Other</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                         <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                <label className="text-sm font-medium text-white/70 ml-1">Shipping Address</label>
                
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-all"
                    placeholder="Street Address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-all"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-all"
                    placeholder="State / Province"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-all"
                    placeholder="ZIP Code"
                  />
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-all"
                    placeholder="Country"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full py-4 text-lg shadow-xl shadow-pink-500/20"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving Changes...' : 'Update Profile'}
              </Button>
            </form>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Security</h4>
                  <p className="text-white/50 text-xs">Password & 2FA</p>
                </div>
              </div>
              <Button variant="secondary" className="w-full text-sm">Manage</Button>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-pink-500/20 rounded-xl">
                  <CreditCard className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Payments</h4>
                  <p className="text-white/50 text-xs">Saved cards</p>
                </div>
              </div>
              <Button variant="secondary" className="w-full text-sm">View methods</Button>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
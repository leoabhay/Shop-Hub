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
    gender: user?.gender || 'Not Specified',
    dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
    secondaryEmail: user?.secondaryEmail || ''
  });

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/orders/myorders', {
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
        gender: user.gender || 'Not Specified',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        secondaryEmail: user.secondaryEmail || ''
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 ml-1">Alternative Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="email"
                      value={formData.secondaryEmail}
                      onChange={(e) => setFormData({ ...formData, secondaryEmail: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-all"
                      placeholder="Alternative email (gmail/email)"
                    />
                  </div>
                </div>
              </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70 ml-1">Gender</label>
                    <div className="relative">
                      <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-all appearance-none"
                      >
                        <option value="Not Specified">Not Specified</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70 ml-1">Date of Birth</label>
                    <div className="relative">
                      <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500 focus:bg-white/10 transition-all"
                      />
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

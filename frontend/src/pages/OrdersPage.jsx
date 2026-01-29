import React, { useState, useEffect } from 'react';
import { Eye, X, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const OrdersPage = () => {
  const { user, showNotification } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      } else {
        showNotification(data.message || 'Error fetching orders', 'error');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <GlassCard className="p-16">
          <h2 className="text-3xl font-bold text-white mb-4">Please Login</h2>
          <p className="text-white/70">You need to be logged in to view your orders.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">My Orders</h1>
      
      {loading ? (
        <p className="text-white text-center">Loading orders...</p>
      ) : orders.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <p className="text-white/60 text-lg">You haven't placed any orders yet.</p>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <GlassCard key={order._id} className="p-6">
              <div className="flex flex-wrap justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Order #{order._id.slice(-6)}</h3>
                  <p className="text-white/60">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-5 py-2 rounded-xl font-bold text-sm tracking-wide shadow-lg backdrop-blur-md border ${
                  order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                  order.status === 'Processing' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                  order.status === 'Shipped' ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' :
                  'bg-white/10 text-white border-white/20'
                }`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white/70">{order.orderItems?.length || 0} items</p>
                  <p className="text-white/40 text-xs">Payment: {order.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 mb-1 text-sm">Total Amount</p>
                  <p className="text-2xl font-bold text-pink-400">Rs. {order.totalPrice.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setSelectedOrder(order)}>
                  <Eye className="w-4 h-4 mr-2 inline" />
                  View Details
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-6 h-6 rotate-45" />
            </button>

            <h2 className="text-3xl font-bold text-white mb-2">Order Details</h2>
            <p className="text-white/40 mb-8 font-mono">ID: {selectedOrder._id}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-white/10">
               <div>
                  <h4 className="text-pink-400 font-bold uppercase text-xs tracking-widest mb-3">Shipping Address</h4>
                  <div className="text-white/80 space-y-1">
                     <p>{selectedOrder.shippingAddress.street}</p>
                     <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zipCode}</p>
                     <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
               </div>
               <div>
                  <h4 className="text-pink-400 font-bold uppercase text-xs tracking-widest mb-3">Order Status</h4>
                  <div className="space-y-2">
                     <p className="text-white/80">Payment: <span className={selectedOrder.isPaid ? "text-green-400" : "text-yellow-400"}>{selectedOrder.isPaid ? 'Paid' : 'Pending'}</span></p>
                     <p className="text-white/80">Delivery: <span className={selectedOrder.isDelivered ? "text-green-400" : "text-yellow-400"}>{selectedOrder.isDelivered ? 'Delivered' : 'In Progress'}</span></p>
                     <p className="text-white/80 font-bold">Status: {selectedOrder.status}</p>
                  </div>
               </div>
            </div>

            <h4 className="text-pink-400 font-bold uppercase text-xs tracking-widest mb-4">Items Summary</h4>
            <div className="space-y-4 mb-8">
               {selectedOrder.orderItems.map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white/20">
                          <Package className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-white/40 text-sm">{item.quantity} x Rs. {item.price}</p>
                       </div>
                    </div>
                    <p className="text-white font-bold">Rs. {item.quantity * item.price}</p>
                 </div>
               ))}
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3">
               <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>Rs. {selectedOrder.itemsPrice.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span>Rs. {selectedOrder.shippingPrice.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-white/60">
                  <span>Tax</span>
                  <span>Rs. {selectedOrder.taxPrice.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-white pt-3 border-t border-white/10 font-bold text-xl">
                  <span>Total</span>
                  <span className="text-pink-400">Rs. {selectedOrder.totalPrice.toFixed(2)}</span>
               </div>
            </div>

            <Button onClick={() => setSelectedOrder(null)} className="w-full mt-8 py-3">
               Close Details
            </Button>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
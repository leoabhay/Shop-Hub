import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const OrdersPage = () => {
  const { user } = useApp();
  const [orders] = useState([
    {
      id: 'ORD-001',
      date: '2026-01-08',
      status: 'Delivered',
      total: 5420,
      items: 3
    },
    {
      id: 'ORD-002',
      date: '2026-01-10',
      status: 'Processing',
      total: 3250,
      items: 2
    }
  ]);

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
      
      <div className="space-y-6">
        {orders.map(order => (
          <GlassCard key={order.id} className="p-6">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Order {order.id}</h3>
                <p className="text-white/60">Placed on {order.date}</p>
              </div>
              <span className={`px-4 py-2 rounded-full font-semibold ${
                order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                order.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/70">{order.items} items</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-pink-400">Rs. {order.total.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <Button variant="secondary" className="w-full sm:w-auto">
                <Eye className="w-4 h-4 mr-2 inline" />
                View Details
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
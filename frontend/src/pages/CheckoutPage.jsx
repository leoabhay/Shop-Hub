import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const CheckoutPage = ({ onNavigate }) => {
  const { cart, user, showNotification } = useApp();
  const [shippingData, setShippingData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Khalti');

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.13;
  const shipping = 100;
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      showNotification('Please login to place an order', 'error');
      onNavigate('login');
      return;
    }

    showNotification('Order placed successfully!', 'success');
    setTimeout(() => onNavigate('orders'), 2000);
  };

  const handleKhaltiPayment = () => {
    // Khalti payment integration placeholder
    const config = {
      publicKey: import.meta.env.VITE_KHALTI_PUBLIC_KEY,
      productIdentity: 'order_' + Date.now(),
      productName: 'Shop Hub Order',
      productUrl: window.location.href,
      eventHandler: {
        onSuccess(payload) {
          console.log('Payment successful:', payload);
          showNotification('Payment successful!', 'success');
        },
        onError(error) {
          console.error('Payment error:', error);
          showNotification('Payment failed. Please try again.', 'error');
        },
        onClose() {
          console.log('Payment widget closed');
        }
      },
      paymentPreference: ['KHALTI'],
    };
    
    showNotification('Opening Khalti payment gateway...', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <GlassCard className="p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Street Address"
                value={shippingData.street}
                onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-pink-400"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={shippingData.city}
                  onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-pink-400"
                  required
                />
                <input
                  type="text"
                  placeholder="State/Province"
                  value={shippingData.state}
                  onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-pink-400"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={shippingData.zipCode}
                  onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-pink-400"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={shippingData.phone}
                  onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-pink-400"
                  required
                />
              </div>
            </form>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-4 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="Khalti"
                  checked={paymentMethod === 'Khalti'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5"
                />
                <div className="flex-1">
                  <p className="text-white font-semibold">Khalti</p>
                  <p className="text-white/60 text-sm">Pay securely with Khalti</p>
                </div>
                <div className="px-4 py-2 bg-purple-500/20 rounded-lg">
                  <span className="text-purple-400 font-bold">Khalti</span>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5"
                />
                <div className="flex-1">
                  <p className="text-white font-semibold">Cash on Delivery</p>
                  <p className="text-white/60 text-sm">Pay when you receive your order</p>
                </div>
              </label>
            </div>
          </GlassCard>
        </div>

        <div>
          <GlassCard className="p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.product._id} className="flex justify-between text-white/80">
                  <span className="flex-1">{item.product.name} x {item.quantity}</span>
                  <span>Rs. {(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-white/20 pt-4 space-y-2">
                <div className="flex justify-between text-white/80">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Tax (13%)</span>
                  <span>Rs. {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Shipping</span>
                  <span>Rs. {shipping.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between text-white font-bold text-xl">
                  <span>Total</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            {paymentMethod === 'Khalti' ? (
              <Button onClick={handleKhaltiPayment} className="w-full">
                Pay with Khalti
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="w-full">
                Place Order
              </Button>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
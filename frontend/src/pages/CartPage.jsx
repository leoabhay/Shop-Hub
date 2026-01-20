import React from 'react';
import { ShoppingCart, Package, Plus, Minus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const CartPage = ({ onNavigate }) => {
  const { cart, removeFromCart, updateCartQuantity } = useApp();

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.13;
  const shipping = subtotal > 0 ? 100 : 0;
  const total = subtotal + tax + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <GlassCard className="p-16">
          <ShoppingCart className="w-24 h-24 text-white/30 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
          <p className="text-white/70 mb-8">Add some products to get started!</p>
          <Button onClick={() => onNavigate('products')}>
            Browse Products
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <GlassCard key={item.product._id} className="p-6">
              <div className="flex gap-6">
                <div className="w-24 h-24 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-12 h-12 text-white/30" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{item.product.name}</h3>
                  <p className="text-pink-400 font-bold mb-4">Rs. {item.product.price}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                      <button
                        onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}
                        className="text-white hover:text-pink-400"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}
                        className="text-white hover:text-pink-400"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    Rs. {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div>
          <GlassCard className="p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
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
              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between text-white font-bold text-xl">
                  <span>Total</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Button onClick={() => onNavigate('checkout')} className="w-full">
              Proceed to Checkout
            </Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
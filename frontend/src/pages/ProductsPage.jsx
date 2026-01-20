import React, { useState } from 'react';
import { Package, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const ProductsPage = () => {
  const { products, addToCart } = useApp();
  const [filter, setFilter] = useState('all');

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">All Products</h1>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {['all', 'Electronics', 'Clothing', 'Books', 'Home & Garden'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full transition-all whitespace-nowrap ${
              filter === cat
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <GlassCard key={product._id} hover className="p-4">
            <div className="aspect-square bg-white/5 rounded-xl mb-4 flex items-center justify-center">
              <Package className="w-16 h-16 text-white/30" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{product.name}</h3>
            <p className="text-white/70 text-sm mb-3 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl font-bold text-pink-400">Rs. {product.price}</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white/80 text-sm">{product.ratings.toFixed(1)}</span>
              </div>
            </div>
            <span className="text-xs text-white/60 mb-3 block">Stock: {product.stock}</span>
            <Button onClick={() => addToCart(product)} className="w-full py-2 text-sm">
              Add to Cart
            </Button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
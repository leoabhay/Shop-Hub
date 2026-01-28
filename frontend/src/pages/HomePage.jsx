import React from 'react';
import { Package, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const HomePage = ({ onNavigate }) => {
  const { products, addToCart, setCurrentPage, setViewingItemId } = useApp();
  const featuredProducts = products.slice(0, 6);

  const handleViewDetails = (id) => {
    setViewingItemId(id);
    setCurrentPage('product-details');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            Welcome to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Shop Hub</span>
          </h1>
          <p className="text-2xl text-white/80 mb-8">
            Discover amazing products at unbeatable prices
          </p>
          <Button onClick={() => onNavigate('products')} className="text-lg px-8 py-4">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <GlassCard key={product._id} hover className="p-6">
                <div className="aspect-square bg-white/5 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
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
                    <Package className="w-20 h-20 text-white/30" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-white/70 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-pink-400">
                    Rs. {product.price}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white/80">{product.ratings.toFixed(1)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={() => addToCart(product)} className="w-full">
                    Add to Cart
                  </Button>
                  <Button variant="secondary" onClick={() => handleViewDetails(product._id)} className="w-full">
                    Details
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Electronics', 'Clothing', 'Books', 'Home & Garden'].map(category => (
              <GlassCard key={category} hover className="p-8 text-center cursor-pointer">
                <h3 className="text-xl font-bold text-white">{category}</h3>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
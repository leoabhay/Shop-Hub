import React from 'react';
import { Package, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const HomePage = ({ onNavigate }) => {
  const { products, addToCart, setCurrentPage, setViewingItemId, filterByCategory } = useApp();
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden'];

  const handleViewDetails = (id) => {
    setViewingItemId(id);
    setCurrentPage('product-details');
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-7xl font-extrabold text-white mb-6 leading-tight">
            Elevate Your <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">Lifestyle</span>
          </h1>
          <p className="text-2xl text-white/70 mb-10 max-w-2xl mx-auto">
            Curated collections of premium products delivered straight to your doorstep.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => onNavigate('products')} className="text-lg px-10 py-4 shadow-xl shadow-pink-500/20">
              Explore All
            </Button>
            <Button variant="secondary" onClick={() => scrollToSection('categories-menu')} className="text-lg px-10 py-4">
              Categories
            </Button>
          </div>
        </div>
      </section>

      {/* Hero Category Selection */}
      <section id="categories-menu" className="py-12 px-4 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <GlassCard 
                key={category} 
                hover 
                onClick={() => scrollToSection(category.toLowerCase().replace(/\s+/g, '-'))}
                className="p-8 text-center cursor-pointer group border-white/5 active:scale-95 transition-transform"
              >
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-500/20 transition-colors">
                  <Package className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors">{category}</h3>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamically Created Category Sections */}
      {categories.map((category) => {
        const categoryProducts = products.filter(p => p.category === category).slice(0, 4);
        if (categoryProducts.length === 0) return null;

        return (
          <section 
            key={category} 
            id={category.toLowerCase().replace(/\s+/g, '-')} 
            className="py-16 px-4 scroll-mt-24"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">{category}</h2>
                  <div className="h-1.5 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                </div>
                <Button 
                  variant="secondary" 
                  className="text-sm px-6"
                  onClick={() => filterByCategory(category)}
                >
                  View All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {categoryProducts.map(product => (
                  <GlassCard key={product._id} hover className="p-4 flex flex-col">
                    <div className="aspect-[4/5] bg-white/5 rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative group">
                      {product.images?.[0] ? (
                        <img 
                          src={product.images[0].startsWith('data:') ? product.images[0] : `${import.meta.env.VITE_SERVER_URL}${product.images[0]}`} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <Package className="w-16 h-16 text-white/20" />
                      )}
                      {product.discountPrice && (
                        <div className="absolute top-3 left-3 bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                          Sale
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.ratings) ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} />
                      ))}
                      <span className="text-[10px] text-white/50 ml-1">({product.numReviews || 0})</span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl font-bold text-white">Rs. {product.price}</span>
                        {product.discountPrice && (
                          <span className="text-sm text-white/40 line-through">Rs. {product.discountPrice}</span>
                        )}
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        <Button onClick={() => addToCart(product)} className="col-span-3 py-2 text-xs">
                          Add to Cart
                        </Button>
                        <Button 
                          variant="secondary" 
                          onClick={() => handleViewDetails(product._id)} 
                          className="col-span-2 py-2 text-xs bg-white/5 border-white/10 hover:bg-white/10"
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default HomePage;
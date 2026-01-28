import React, { useState, useEffect } from 'react';
import { Package, Star, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const ProductDetailsPage = ({ productId, onBack }) => {
  const { products, addToCart, showNotification } = useApp();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const found = products.find(p => p._id === productId);
    if (found) {
      setProduct(found);
    }
  }, [productId, products]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <GlassCard className="p-16">
          <p className="text-white text-xl">Loading product details...</p>
        </GlassCard>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Basic implementation of quantity support if needed
    for(let i=0; i<quantity; i++) {
        addToCart(product);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <GlassCard className="aspect-square relative overflow-hidden flex items-center justify-center p-4">
            {product.images?.[selectedImage] ? (
              <img 
                src={product.images[selectedImage].startsWith('data:') ? product.images[selectedImage] : `http://localhost:5000${product.images[selectedImage]}`} 
                alt={product.name}
                className="max-h-full max-w-full object-contain hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <Package className="w-32 h-32 text-white/20" />
            )}
            {product.discountPrice && (
              <div className="absolute top-6 right-6 bg-pink-500 text-white px-4 py-1 rounded-full font-bold shadow-lg">
                OFFER
              </div>
            )}
          </GlassCard>
          
          <div className="grid grid-cols-5 gap-4">
            {product.images?.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === idx ? 'border-pink-500 bg-white/10' : 'border-transparent bg-white/5 hover:bg-white/10'
                }`}
              >
                <img 
                  src={img.startsWith('data:') ? img : `http://localhost:5000${img}`} 
                  alt="" 
                  className="w-full h-full object-cover" 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/30">
                {product.category}
              </span>
              <span className="text-white/40 text-sm">Brand: {product.brand || 'ShopHub Exclusive'}</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-lg">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.round(product.ratings) ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`} 
                  />
                ))}
                <span className="text-white font-bold ml-2">{product.ratings.toFixed(1)}</span>
              </div>
              <span className="text-white/40">|</span>
              <span className="text-green-400 font-medium">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
            </div>
            
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-5xl font-extrabold text-pink-400">Rs. {product.price}</span>
              {product.discountPrice && (
                <span className="text-2xl text-white/30 line-through">Rs. {product.discountPrice}</span>
              )}
            </div>

            <p className="text-xl text-white/70 leading-relaxed mb-8">
              {product.description}
            </p>
          </div>

          <GlassCard className="p-6 space-y-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-white/10 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-white/10 text-white text-xl"
                >-</button>
                <span className="px-6 py-2 text-white font-bold text-lg min-w-[3rem] text-center">{quantity}</span>
                <button 
                   onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 hover:bg-white/10 text-white text-xl"
                >+</button>
              </div>
              <p className="text-white/50 text-sm">Only {product.stock} items left!</p>
            </div>

            <Button onClick={handleAddToCart} className="w-full py-4 text-xl flex items-center justify-center gap-3">
              <ShoppingCart className="w-6 h-6" />
              Add to Shopping Cart
            </Button>
          </GlassCard>

          <div className="grid grid-cols-3 gap-4">
             <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <Truck className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-white text-sm font-bold">Free Delivery</p>
                <p className="text-white/40 text-xs">On orders over Rs. 2000</p>
             </div>
             <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <RefreshCcw className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <p className="text-white text-sm font-bold">7 Days Return</p>
                <p className="text-white/40 text-xs">Easy & free returns</p>
             </div>
             <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <ShieldCheck className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-white text-sm font-bold">100% Genuine</p>
                <p className="text-white/40 text-xs">Certified quality</p>
             </div>
          </div>
        </div>
      </div>
      
      {/* Reviews Section Placeholder */}
      <GlassCard className="p-12 mb-16">
        <h2 className="text-3xl font-bold text-white mb-8">Customer Reviews</h2>
        <div className="space-y-8">
           {product.reviews?.length > 0 ? product.reviews.map((rev, i) => (
             <div key={i} className="border-b border-white/10 pb-8 last:border-0 last:pb-0">
                <div className="flex items-center gap-4 mb-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white">
                      {rev.name.charAt(0)}
                   </div>
                   <div>
                      <p className="text-white font-bold">{rev.name}</p>
                      <div className="flex gap-1">
                         {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`w-3 h-3 ${j < rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`} />
                         ))}
                      </div>
                   </div>
                </div>
                <p className="text-white/70">{rev.comment}</p>
             </div>
           )) : (
             <div className="text-center py-8">
                <Star className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/40">No reviews yet for this product.</p>
             </div>
           )}
        </div>
      </GlassCard>
    </div>
  );
};

export default ProductDetailsPage;

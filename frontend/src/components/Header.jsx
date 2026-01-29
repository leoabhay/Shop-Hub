import React, { useState } from 'react';
import { ShoppingCart, User, Search, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from './GlassCard';
import Button from './Button';

const Header = ({ onNavigate, currentPage }) => {
  const { user, cart, logout, loadProducts, setCurrentPage } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts(searchQuery);
    setCurrentPage('products');
  };

  return (
    <header className="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 
              onClick={() => onNavigate('home')}
              className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent cursor-pointer"
            >
              Shop Hub
            </h1>
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-4 bg-white/10 rounded-full px-4 py-2 border border-white/20">
              <Search className="w-5 h-5 text-white/70" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-white/50 w-64"
              />
            </form>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`text-white/90 hover:text-white transition-colors ${currentPage === 'home' ? 'font-bold' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('products')}
              className={`text-white/90 hover:text-white transition-colors ${currentPage === 'products' ? 'font-bold' : ''}`}
            >
              Products
            </button>
            {user && (
              <>
                <button
                  onClick={() => onNavigate('orders')}
                  className={`text-white/90 hover:text-white transition-colors ${currentPage === 'orders' ? 'font-bold' : ''}`}
                >
                  Orders
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`text-white/90 hover:text-white transition-colors ${currentPage === 'admin' ? 'font-bold' : ''}`}
                  >
                    Admin
                  </button>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {user && (
              <button onClick={() => onNavigate('cart')} className="relative text-white hover:scale-110 transition-transform">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 text-white hover:scale-105 transition-transform"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden md:block">{user.name}</span>
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48">
                    <GlassCard className="p-2">
                      <button
                        onClick={() => {
                          onNavigate('profile');
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </GlassCard>
                  </div>
                )}
              </div>
            ) : (
              <Button onClick={() => onNavigate('login')} variant="secondary">
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

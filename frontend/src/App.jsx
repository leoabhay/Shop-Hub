import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Notification from './components/Notification';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import AuthPage from './pages/AuthPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/AdminDashboard';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ProfilePage from './pages/ProfilePage';
import ProductDetailsPage from './pages/ProductDetailsPage';

const AppContent = () => {
  const { currentPage, setCurrentPage, viewingItemId, filterByCategory } = useApp();
  const [verifyToken, setVerifyToken] = useState(null);

  React.useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/verify-email')) {
      const token = path.split('/')[2];
      setVerifyToken(token);
      setCurrentPage('verify');
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'products':
        return <ProductsPage />;
      case 'cart':
        return <CartPage onNavigate={setCurrentPage} />;
      case 'checkout':
        return <CheckoutPage onNavigate={setCurrentPage} />;
      case 'orders':
        return <OrdersPage />;
      case 'login':
        return <AuthPage onNavigate={setCurrentPage} />;
      case 'admin':
        return <AdminDashboard />;
      case 'verify':
        return <VerifyEmailPage token={verifyToken} onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfilePage />;
      case 'product-details':
        return (
          <ProductDetailsPage 
            productId={viewingItemId} 
            onBack={() => setCurrentPage('products')} 
          />
        );
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
      <Notification />
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      
      <main className="flex-grow">
        {renderPage()}
      </main>
      
      <footer className="backdrop-blur-xl bg-white/5 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Shop Hub
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Your premium destination for high-quality electronics, fashion, and home essentials. Experience the future of shopping.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 italic">Quick Links</h4>
              <ul className="space-y-3 text-white/50 text-sm">
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-pink-400 transition-colors">Home</button></li>
                <li><button onClick={() => setCurrentPage('products')} className="hover:text-pink-400 transition-colors">All Products</button></li>
                <li><button onClick={() => setCurrentPage('profile')} className="hover:text-pink-400 transition-colors">My Account</button></li>
                <li><button onClick={() => setCurrentPage('orders')} className="hover:text-pink-400 transition-colors">Track Orders</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 italic">Categories</h4>
              <ul className="space-y-3 text-white/50 text-sm">
                {['Electronics', 'Clothing', 'Books', 'Home & Garden'].map(cat => (
                  <li 
                    key={cat} 
                    onClick={() => filterByCategory(cat)}
                    className="hover:text-pink-400 cursor-pointer transition-colors"
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 italic">Store Info</h4>
              <ul className="space-y-3 text-white/60 text-sm">
                <li className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                   Bhaktapur, Nepal
                </li>
                <li className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                   +977 9800000000
                </li>
                <li className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   abhaycdry10@gmail.com
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-xs">
            <p>&copy; 2026 Shop Hub. Built with passion for modern commerce.</p>
            <div className="flex gap-8">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-white cursor-pointer transition-colors">Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
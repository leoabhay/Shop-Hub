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
  const { currentPage, setCurrentPage, viewingItemId, setViewingItemId } = useApp();
  const [verifyToken, setVerifyToken] = useState(null);

  React.useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/verify-email/')) {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
      <Notification />
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      {renderPage()}
      
      <footer className="backdrop-blur-md bg-white/10 border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-white/70">
            <p>&copy; 2026 Shop Hub. All rights reserved.</p>
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
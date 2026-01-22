import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
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

const App = () => {
  // Initialize state from URL on mount
  const getInitialState = () => {
    const hash = window.location.hash;
    if (hash.includes('/verify-email/')) {
      const token = hash.split('/verify-email/')[1];
      return {
        page: 'verify',
        token: token || null
      };
    }
    return {
      page: 'home',
      token: null
    };
  };

  const initialState = getInitialState();
  const [currentPage, setCurrentPage] = useState(initialState.page);
  const [verificationToken] = useState(initialState.token);

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
        return <VerifyEmailPage token={verificationToken} onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
        <Notification />
        <Header onNavigate={setCurrentPage} currentPage={currentPage} />
        {renderPage()}
        
        <footer className="backdrop-blur-md bg-white/10 border-t border-white/20 mt-20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center text-white/70">
              <p>&copy; 2026 Shop Hub. All rights reserved.</p>
              <p className="mt-2">Built with React, Tailwind CSS, Node.js & MongoDB</p>
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
};

export default App;
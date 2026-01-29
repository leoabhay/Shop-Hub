import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white',
    secondary: 'bg-white/20 hover:bg-white/30 text-white border border-white/30',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };

  return (
    <button
      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

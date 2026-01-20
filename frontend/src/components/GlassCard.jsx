import React from 'react';

const GlassCard = ({ children, className = '', hover = false }) => (
  <div className={`
    backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl
    ${hover ? 'hover:bg-white/20 hover:scale-105 transition-all duration-300' : ''}
    ${className}
  `}>
    {children}
  </div>
);

export default GlassCard;
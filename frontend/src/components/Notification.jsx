import React from 'react';
import { useApp } from '../context/AppContext';
import GlassCard from './GlassCard';

const Notification = () => {
  const { notification } = useApp();
  
  if (!notification) return null;

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <GlassCard className={`${colors[notification.type]} px-6 py-4`}>
        <p className="text-white font-semibold">{notification.message}</p>
      </GlassCard>
    </div>
  );
};

export default Notification;
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const VerifyEmailPage = ({ token, onNavigate }) => {
  const { showNotification } = useApp();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const verificationStarted = React.useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (verificationStarted.current) return;
      verificationStarted.current = true;
      
      try {
        const res = await fetch(`http://localhost:5000/api/auth/verify/${token}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus('success');
          setMessage('Email verified successfully! You can now log in to your account.');
          
          showNotification('Verification successful! Please log in.', 'success');
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            window.history.pushState({}, '', '/'); // Clear the URL
            onNavigate('login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed');
          showNotification(data.message || 'Verification failed', 'error');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Network error. Please try again.');
        showNotification('Network error. Please try again.', error);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <GlassCard className="p-8 w-full max-w-md text-center">
        {status === 'loading' && (
          <>
            <Loader className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-white mb-2">Verifying Your Email</h2>
            <p className="text-white/70">Please wait while we verify your email address...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-white/70 mb-6">{message}</p>
            <div className="space-y-3">
              <Button onClick={() => onNavigate('login')} className="w-full">
                Login Now
              </Button>
            </div>
            <p className="text-white/40 text-xs mt-6 italic">Redirecting you in a few seconds...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-white/70 mb-6">{message}</p>
            <div className="space-y-3">
              <Button onClick={() => onNavigate('login')} className="w-full">
                Go to Login
              </Button>
              <Button onClick={() => onNavigate('home')} variant="secondary" className="w-full">
                Go to Homepage
              </Button>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
};

export default VerifyEmailPage;
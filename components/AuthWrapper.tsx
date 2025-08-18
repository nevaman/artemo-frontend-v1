import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { ArtemoFullLogo } from './Icons';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [forceShowLogin, setForceShowLogin] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);
  
  // Set a timeout to force show login if loading takes too long
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('⏰ Loading timeout reached - forcing login form');
      setTimeoutReached(true);
    }, 3000); // 3 second timeout

    return () => clearTimeout(timeout);
  }, []);

  const { user, loading } = useAuth();

  console.log('🎯 AuthWrapper State:', { 
    hasUser: !!user, 
    loading, 
    userEmail: user?.email || 'none',
    timeoutReached,
    forceShowLogin,
    timestamp: new Date().toLocaleTimeString()
  });

  // Force show login form if timeout reached or explicitly requested
  if (timeoutReached || forceShowLogin) {
    console.log('🔐 Forcing login form due to timeout or manual trigger');
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <button 
            onClick={() => setForceShowLogin(false)}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
          >
            Retry Auth
          </button>
        </div>
        <LoginForm />
      </div>
    );
  }

  if (loading) {
    console.log('⏳ Still loading authentication...');
    return (
      <div className="min-h-screen bg-light-bg-page dark:bg-dark-bg-page flex items-center justify-center">
        <div className="text-center">
          <ArtemoFullLogo className="h-12 mx-auto mb-6" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-accent mx-auto mb-4"></div>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">Connecting to database...</p>
          <button 
            onClick={() => setForceShowLogin(true)}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Skip to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🔐 No authenticated user - showing login form');
    return <LoginForm />;
  }

  console.log('✅ User authenticated successfully - showing dashboard for:', user.email);
  return <>{children}</>;
};
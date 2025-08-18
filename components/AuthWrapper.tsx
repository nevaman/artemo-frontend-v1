import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { ArtemoFullLogo } from './Icons';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [forceShowLogin, setForceShowLogin] = useState(false);

  const { user, loading } = useAuth();

  console.log('🎯 AuthWrapper render state:', { 
    hasUser: !!user, 
    loading, 
    userEmail: user?.email || 'none',
    forceShowLogin,
    shouldShowLogin: forceShowLogin || (!loading && !user)
  });

  // Force show login form if explicitly requested
  if (forceShowLogin) {
    console.log('🔐 Showing login form due to manual trigger');
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <button 
            onClick={() => {
              setForceShowLogin(false);
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Retry Auth
          </button>
        </div>
        <LoginForm />
      </div>
    );
  }

  if (loading) {
    console.log('⏳ AuthWrapper still loading authentication...');
    return (
      <div className="min-h-screen bg-light-bg-page dark:bg-dark-bg-page flex items-center justify-center">
        <div className="text-center">
          <ArtemoFullLogo className="h-12 mx-auto mb-6" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-accent mx-auto mb-4"></div>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">Loading authentication...</p>
          <button 
            onClick={() => setForceShowLogin(true)}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          >
            Skip to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🔐 No authenticated user found - showing login form');
    return <LoginForm />;
  }

  console.log('✅ User authenticated successfully - showing main app for:', user.email);
  return <>{children}</>;
};
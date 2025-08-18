import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { ArtemoFullLogo } from './Icons';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('🎯 AuthWrapper State:', { 
    hasUser: !!user, 
    loading, 
    userEmail: user?.email || 'none',
    timestamp: new Date().toLocaleTimeString()
  });

  if (loading) {
    console.log('⏳ Showing loading screen...');
    return (
      <div className="min-h-screen bg-light-bg-page dark:bg-dark-bg-page flex items-center justify-center">
        <div className="text-center">
          <ArtemoFullLogo className="h-12 mx-auto mb-6" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-accent mx-auto mb-4"></div>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">Loading authentication...</p>
          <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-2">
            Check console for debug info
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🔐 No user found, showing login form');
    return <LoginForm />;
  }

  console.log('✅ User authenticated, showing app for:', user.email);
  return <>{children}</>;
};
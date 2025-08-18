import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { ArtemoFullLogo } from './Icons';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('🎯 AuthWrapper Render:', { 
    hasUser: !!user, 
    loading, 
    userEmail: user?.email || 'none',
    timestamp: new Date().toLocaleTimeString(),
    shouldShowLogin: !loading && !user,
    shouldShowApp: !loading && !!user
  });

  if (loading) {
    console.log('⏳ Still loading authentication...');
    return (
      <div className="min-h-screen bg-light-bg-page dark:bg-dark-bg-page flex items-center justify-center">
        <div className="text-center">
          <ArtemoFullLogo className="h-12 mx-auto mb-6" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-accent mx-auto mb-4"></div>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">Connecting to database...</p>
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
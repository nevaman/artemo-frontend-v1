import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ArtemoFullLogo, EyeIcon, EyeOffIcon } from './Icons';

export const LoginForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!fullName.trim()) {
          setError('Full name is required');
          return;
        }
        await signUp(email, password, fullName);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg-page dark:bg-dark-bg-page flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-light-bg-component dark:bg-dark-bg-component rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <ArtemoFullLogo className="h-12 mx-auto mb-4" />
            <h1 className="font-serif text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
              {isLogin ? 'Sign in to your account' : 'Get started with Artemo AI (no email verification required)'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 border border-light-border dark:border-dark-border rounded-md bg-light-bg-component dark:bg-dark-bg-component text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary-accent focus:border-primary-accent outline-none"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-light-border dark:border-dark-border rounded-md bg-light-bg-component dark:bg-dark-bg-component text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary-accent focus:border-primary-accent outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-10 border border-light-border dark:border-dark-border rounded-md bg-light-bg-component dark:bg-dark-bg-component text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-primary-accent focus:border-primary-accent outline-none"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary"
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary-accent text-text-on-accent rounded-md font-medium hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-primary-accent hover:underline font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
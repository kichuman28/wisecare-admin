import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
// Import the illustration
import oldManIllustration from '../assets/animation/old-man.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Sign in with Firebase
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Invalid email address format');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later');
          break;
        default:
          setError('An error occurred. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left side - Illustration */}
      <div className="lg:hidden w-full bg-primary py-8 px-4">
        <div className="max-w-xs mx-auto">
          <div className="flex justify-center">
            <img
              src={oldManIllustration}
              alt="Elderly person using a mobile device"
              className="w-3/4 h-auto object-contain"
            />
          </div>
          <h2 className="text-white text-2xl font-bold text-center mt-4 tracking-tight">
            Welcome to WiseCare Admin
          </h2>
          <p className="text-primary-light text-center mt-2 text-base font-medium tracking-wide">
            Manage your healthcare services efficiently and securely
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <img
              src={oldManIllustration}
              alt="Elderly person using a mobile device"
              className="w-4/5 h-auto object-contain"
            />
          </div>
          <h2 className="text-white text-4xl font-bold text-center mt-8 tracking-tight">
            Welcome to WiseCare Admin
          </h2>
          <p className="text-primary-light text-center mt-4 text-lg font-medium tracking-wide">
            Manage your healthcare services efficiently and securely
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-6 lg:p-8">
        <div className="max-w-md w-full space-y-6 lg:space-y-8">
          <div>
            <h2 className="mt-2 lg:mt-6 text-center text-3xl lg:text-4xl font-bold text-primary tracking-tight">
              Sign in to WiseCare
            </h2>
            <p className="mt-2 lg:mt-3 text-center text-sm lg:text-base text-gray-600 font-medium">
              Access your admin dashboard
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <form className="mt-6 lg:mt-8 space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 lg:space-y-5">
              <div>
                <label htmlFor="email-address" className="block text-sm font-semibold text-gray-700">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-hover focus:border-primary-hover text-sm lg:text-base"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-hover focus:border-primary-hover text-sm lg:text-base pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary-hover border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 lg:py-3 px-4 border border-transparent text-sm lg:text-base font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-hover transition-all duration-200 disabled:bg-primary-light disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="mt-4 text-center space-y-1">
              <p className="text-sm text-gray-600 font-medium">Demo credentials:</p>
              <p className="text-sm font-semibold text-primary">Email: admin@wisecare.in</p>
              <p className="text-sm font-semibold text-primary">Password: admin123</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
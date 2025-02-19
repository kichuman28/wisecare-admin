import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import OldManIllustration from './admin_panel/components/illustrations/OldManIllustration';
import ladyDoctorImage from './assets/images/lady-doctor.png';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// Add animation styles
const slideInLeft = "animate-[slide-in-left_0.5s_ease-out]";
const slideInRight = "animate-[slide-in-right_0.5s_ease-out]";
const fadeIn = "animate-[fade-in_0.5s_ease-out]";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    doctorName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDoctorLogin, setIsDoctorLogin] = useState(false);
  const [isFirstTimeDoctor, setIsFirstTimeDoctor] = useState(false);

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

    // Additional validation for first-time doctor login
    if (isFirstTimeDoctor && !formData.doctorName.trim()) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCredential.user.uid;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (!userDoc.exists() && isDoctorLogin) {
        if (!isFirstTimeDoctor) {
          // First time - show name input
          setIsFirstTimeDoctor(true);
          setLoading(false);
          return;
        }

        // Create user and doctor documents with the provided name
        const doctorData = {
          name: formData.doctorName.trim(),
          email: formData.email,
          role: "doctor",  // Ensure consistent string format
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Create user document
        await setDoc(doc(db, 'users', uid), doctorData);

        // Create doctor document with detailed information
        const doctorDetailsData = {
          name: formData.doctorName.trim(),
          email: formData.email,
          specialization: 'General Physician',
          imageUrl: 'https://picsum.photos/200',
          about: 'Experienced healthcare professional dedicated to patient care.',
          rating: 5.0,
          experience: 0,
          patientsServed: 0,
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          availableTimeSlots: {
            'Monday': ['09:00', '10:00', '11:00', '14:00', '15:00'],
            'Tuesday': ['09:00', '10:00', '11:00', '14:00', '15:00'],
            'Wednesday': ['09:00', '10:00', '11:00', '14:00', '15:00'],
            'Thursday': ['09:00', '10:00', '11:00', '14:00', '15:00'],
            'Friday': ['09:00', '10:00', '11:00', '14:00', '15:00'],
          },
          consultationFee: 100.0,
          isAvailable: true,
          uid: uid,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(doc(db, 'doctors', uid), doctorDetailsData);

        console.log('Created doctor documents, signing out...'); // Debug log
        await auth.signOut(); // Sign out after creating documents
        setError('Registration complete! Please log in with your credentials.');
        setIsFirstTimeDoctor(false);
        setLoading(false);
        return;
      }

      // Reset first-time doctor state
      setIsFirstTimeDoctor(false);

      // For existing users, check roles
      const userData = userDoc.data();
      console.log('User data from Firestore:', userData); // Debug log

      // Strict equality check for doctor role
      const isDoctor = userData?.role === "doctor";
      console.log('Is doctor?', isDoctor, 'Role:', userData?.role, 'Type:', typeof userData?.role); // Debug log

      if (isDoctorLogin && !isDoctor) {
        setError('Access denied. This login is for doctors only.');
        await auth.signOut();
        setLoading(false);
        return;
      }

      if (!isDoctorLogin && isDoctor) {
        setError('Please use the doctor login option.');
        await auth.signOut();
        setLoading(false);
        return;
      }

      // Navigate based on role
      if (isDoctor) {
        console.log('Navigating to doctor dashboard'); // Debug log
        navigate('/doctor/dashboard');
      } else {
        console.log('Navigating to admin dashboard'); // Debug log
        navigate('/dashboard');
      }
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

  const toggleLoginType = () => {
    setIsDoctorLogin(prev => !prev);
    setIsFirstTimeDoctor(false);
    setError('');
    setFormData({ email: '', password: '', doctorName: '' });
  };

  const renderLoginForm = () => (
    <div className={`max-w-md w-full space-y-6 lg:space-y-8 ${fadeIn}`}>
      <div>
        <h2 className="mt-2 lg:mt-6 text-center text-3xl lg:text-4xl font-bold text-primary tracking-tight">
          {isDoctorLogin ? 'Doctor Login' : 'Sign in to WiseCare'}
        </h2>
        <p className="mt-2 lg:mt-3 text-center text-sm lg:text-base text-gray-600 font-medium">
          {isDoctorLogin ? 'Access your doctor dashboard' : 'Access your admin dashboard'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <form className="mt-6 lg:mt-8 space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4 lg:space-y-5">
          {isFirstTimeDoctor && (
            <div>
              <label htmlFor="doctor-name" className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                id="doctor-name"
                name="doctorName"
                type="text"
                required
                value={formData.doctorName}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-hover focus:border-primary-hover text-sm lg:text-base"
                placeholder="Enter your full name (e.g., Dr. John Smith)"
              />
            </div>
          )}

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
            {loading ? 'Signing in...' : isFirstTimeDoctor ? 'Complete Registration' : `Sign in as ${isDoctorLogin ? 'Doctor' : 'Admin'}`}
          </button>
        </div>

        {!isDoctorLogin && (
          <div className="mt-4 text-center space-y-1">
            <p className="text-sm text-gray-600 font-medium">Demo credentials:</p>
            <p className="text-sm font-semibold text-primary">Email: admin@wisecare.in</p>
            <p className="text-sm font-semibold text-primary">Password: admin123</p>
          </div>
        )}
      </form>
    </div>
  );

  return (
    <div className="h-screen bg-background overflow-hidden relative">
      <style>
        {`
          @keyframes slide-in-left {
            0% {
              transform: translateX(-100%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes slide-in-right {
            0% {
              transform: translateX(100%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes fade-in {
            0% {
              opacity: 0;
              transform: scale(0.95);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes rotate-scale {
            0% {
              transform: rotate(0deg) scale(1);
            }
            50% {
              transform: rotate(180deg) scale(0.8);
            }
            100% {
              transform: rotate(360deg) scale(1);
            }
          }
          .animate-rotate-scale {
            animation: rotate-scale 0.5s ease-out;
          }
          .transition-all-smooth {
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}
      </style>

      {/* Login Type Toggle with animation */}
      <button
        onClick={toggleLoginType}
        className="absolute top-4 right-4 z-10 flex items-center space-x-2 px-4 py-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all-smooth border border-primary/20 hover:bg-primary hover:text-white group"
      >
        <UserIcon className="h-5 w-5 text-primary group-hover:text-white transition-all-smooth" />
        <span className="text-sm font-medium text-primary group-hover:text-white transition-all-smooth">
          {isDoctorLogin ? 'Switch to Admin' : 'Switch to Doctor'}
        </span>
      </button>

      <div className="h-full flex flex-col lg:flex-row">
        {isDoctorLogin ? (
          <>
            {/* Left side - Login Form for Doctor */}
            <div className={`h-full w-full lg:w-1/2 flex items-center justify-center p-8 ${slideInLeft}`}>
              {renderLoginForm()}
            </div>

            {/* Right side - Doctor Illustration */}
            <div className={`hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12 ${slideInRight}`}>
              <div className="w-full max-w-md">
                <div className={`flex justify-center mb-8 ${fadeIn}`}>
                  <img
                    src={ladyDoctorImage}
                    alt="Doctor illustration"
                    className="w-4/5 h-auto object-contain transform transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <h2 className={`text-white text-4xl font-bold text-center mt-8 tracking-tight ${fadeIn}`}>
                  Welcome to WiseCare
                </h2>
                <p className={`text-primary-light text-center mt-4 text-lg font-medium tracking-wide ${fadeIn}`}>
                  Provide the best care for your patients
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Left side - Illustration for Admin */}
            <div className={`lg:hidden w-full bg-primary py-8 px-4 ${slideInLeft}`}>
              <div className="max-w-xs mx-auto">
                <div className={`flex justify-center ${fadeIn}`}>
                  <OldManIllustration className="w-3/4 h-auto transform transition-transform duration-700 hover:scale-105" />
                </div>
                <h2 className={`text-white text-2xl font-bold text-center mt-4 tracking-tight ${fadeIn}`}>
                  Welcome to WiseCare Admin
                </h2>
                <p className={`text-primary-light text-center mt-2 text-base font-medium tracking-wide ${fadeIn}`}>
                  Manage your healthcare services efficiently and securely
                </p>
              </div>
            </div>

            <div className={`hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12 ${slideInLeft}`}>
              <div className="w-full max-w-md">
                <div className={`flex justify-center mb-8 ${fadeIn}`}>
                  <OldManIllustration className="w-4/5 h-auto transform transition-transform duration-700 hover:scale-105" />
                </div>
                <h2 className={`text-white text-4xl font-bold text-center mt-8 tracking-tight ${fadeIn}`}>
                  Welcome to WiseCare Admin
                </h2>
                <p className={`text-primary-light text-center mt-4 text-lg font-medium tracking-wide ${fadeIn}`}>
                  Manage your healthcare services efficiently and securely
                </p>
              </div>
            </div>

            {/* Right side - Login Form for Admin */}
            <div className={`h-full w-full lg:w-1/2 flex items-center justify-center p-8 ${slideInRight}`}>
              {renderLoginForm()}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DoctorProtectedRoute = ({ children }) => {
  const { user, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Debug logs
  console.log('Doctor Protected Route - User Data:', userData);
  console.log('Doctor Protected Route - Role:', userData?.role);

  // Strict equality check for doctor role
  const isDoctor = userData?.role === "doctor";
  console.log('Doctor Protected Route - Is Doctor?', isDoctor);

  if (!isDoctor) {
    console.log('Access denied: Not a doctor account', { 
      hasUserData: !!userData, 
      role: userData?.role,
      roleType: typeof userData?.role
    });
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default DoctorProtectedRoute; 
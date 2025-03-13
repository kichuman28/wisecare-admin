import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from '../Login';
import AdminRoutes from './admin.routes';
import DoctorRoutes from './doctor.routes';
import { useAuth } from '../context/AuthContext';
import LandingPage from '../pages/LandingPage';

// Root redirect component
const RootRedirect = () => {
  const { userData } = useAuth();
  const location = useLocation();

  if (!userData) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Navigate to={userData?.role === "doctor" ? '/doctor/dashboard' : '/dashboard'} replace />;
};

// Base Protected Route component
const BaseProtectedRoute = ({ children, allowedRole = null }) => {
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

  // If no specific role is required, just check for authentication
  if (!allowedRole) {
    return children;
  }

  // Check for specific role access
  const hasAccess = userData?.role === allowedRole;
  if (!hasAccess) {
    // Redirect doctors to doctor dashboard and others to admin dashboard
    const redirectPath = userData?.role === "doctor" ? "/doctor/dashboard" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page - Public */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Public route */}
      <Route path="/login" element={<Login />} />
      
      {/* Doctor routes - Protected with doctor role */}
      {DoctorRoutes.map(route => ({
        ...route,
        element: <BaseProtectedRoute allowedRole="doctor">{route.props.element}</BaseProtectedRoute>
      }))}
      
      {/* Admin routes - Protected with admin role */}
      {AdminRoutes.map(route => ({
        ...route,
        element: <BaseProtectedRoute allowedRole="admin">{route.props.element}</BaseProtectedRoute>
      }))}

      {/* Dashboard redirect */}
      <Route
        path="/dashboard-redirect"
        element={
          <BaseProtectedRoute>
            <RootRedirect />
          </BaseProtectedRoute>
        }
      />
      
      {/* Catch all other routes and redirect to appropriate dashboard */}
      <Route
        path="*"
        element={
          <BaseProtectedRoute>
            <RootRedirect />
          </BaseProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes; 
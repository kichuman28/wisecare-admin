import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../Login';
import AdminRoutes from './admin.routes';
import DoctorRoutes from './doctor.routes';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../admin_panel/components/ProtectedRoute';

// Root redirect component
const RootRedirect = () => {
  const { userData } = useAuth();
  return <Navigate to={userData?.role === "doctor" ? '/doctor/dashboard' : '/dashboard'} replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />
      
      {/* Doctor routes */}
      {DoctorRoutes}
      
      {/* Admin routes */}
      {AdminRoutes}

      {/* Root redirect */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RootRedirect />
          </ProtectedRoute>
        }
      />
      
      {/* Catch all other routes and redirect to appropriate dashboard */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <RootRedirect />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes; 
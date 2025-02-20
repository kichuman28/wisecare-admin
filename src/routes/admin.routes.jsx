import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../admin_panel/components/ProtectedRoute';
import Dashboard from '../admin_panel/pages/Dashboard';
import SOSAlertsPage from '../admin_panel/pages/SOSAlertsPage';
import UsersPage from '../admin_panel/pages/UsersPage';
import DevicesPage from '../admin_panel/pages/DevicesPage';
import ContentPage from '../admin_panel/pages/ContentPage';
import ServicesPage from '../admin_panel/pages/ServicesPage';
import ReportsPage from '../admin_panel/pages/ReportsPage';
import SettingsPage from '../admin_panel/pages/SettingsPage';
import ConsultationBooking from '../admin_panel/pages/ConsultationBooking';

const AdminRoutes = [
  <Route
    key="dashboard"
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    key="sos-alerts"
    path="/sos-alerts"
    element={
      <ProtectedRoute>
        <SOSAlertsPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="users"
    path="/users"
    element={
      <ProtectedRoute>
        <UsersPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="devices"
    path="/devices"
    element={
      <ProtectedRoute>
        <DevicesPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="content"
    path="/content"
    element={
      <ProtectedRoute>
        <ContentPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="services"
    path="/services"
    element={
      <ProtectedRoute>
        <ServicesPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="consultation-booking"
    path="/services/consultation-booking"
    element={
      <ProtectedRoute>
        <ConsultationBooking />
      </ProtectedRoute>
    }
  />,
  <Route
    key="reports"
    path="/reports"
    element={
      <ProtectedRoute>
        <ReportsPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="settings"
    path="/settings"
    element={
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    }
  />
];

export default AdminRoutes; 
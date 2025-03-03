import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '../admin_panel/pages/Dashboard';
import SOSAlertsPage from '../admin_panel/pages/SOSAlertsPage';
import UsersPage from '../admin_panel/pages/UsersPage';
import DevicesPage from '../admin_panel/pages/DevicesPage';
import ContentPage from '../admin_panel/pages/ContentPage';
import ServicesPage from '../admin_panel/pages/ServicesPage';
import ReportsPage from '../admin_panel/pages/ReportsPage';
import SettingsPage from '../admin_panel/pages/SettingsPage';
import ConsultationBooking from '../admin_panel/pages/ConsultationBooking';
import VideoAnalysisPage from '../admin_panel/pages/VideoAnalysisPage';
import MedicationDeliveryPage from '../admin_panel/pages/MedicationDeliveryPage';

const AdminRoutes = [
  <Route
    key="dashboard"
    path="/dashboard"
    element={<Dashboard />}
  />,
  <Route
    key="sos-alerts"
    path="/sos-alerts"
    element={<SOSAlertsPage />}
  />,
  <Route
    key="users"
    path="/users"
    element={<UsersPage />}
  />,
  <Route
    key="devices"
    path="/devices"
    element={<DevicesPage />}
  />,
  <Route
    key="content"
    path="/content"
    element={<ContentPage />}
  />,
  <Route
    key="services"
    path="/services"
    element={<ServicesPage />}
  />,
  <Route
    key="consultation-booking"
    path="/services/consultation-booking"
    element={<ConsultationBooking />}
  />,
  <Route
    key="medication-delivery"
    path="/services/medication-delivery"
    element={<MedicationDeliveryPage />}
  />,
  <Route
    key="video-analysis"
    path="/video-analysis"
    element={<VideoAnalysisPage />}
  />,
  <Route
    key="reports"
    path="/reports"
    element={<ReportsPage />}
  />,
  <Route
    key="settings"
    path="/settings"
    element={<SettingsPage />}
  />
];

export default AdminRoutes; 
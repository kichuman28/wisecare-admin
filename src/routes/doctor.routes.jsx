import React from 'react';
import { Route } from 'react-router-dom';
import DoctorDashboard from '../doctor_panel/pages/dashboard/doctor_dashboard';
import DoctorAppointments from '../doctor_panel/pages/appointments/doctor_appointments';
import DoctorPatients from '../doctor_panel/pages/patients/doctor_patients';
import DoctorConsultations from '../doctor_panel/pages/consultations/doctor_consultations';
import DoctorRecords from '../doctor_panel/pages/records/doctor_records';
import DoctorMessages from '../doctor_panel/pages/messages/doctor_messages';
import DoctorSettings from '../doctor_panel/pages/settings/doctor_settings';
import DoctorProtectedRoute from './DoctorProtectedRoute';

const DoctorRoutes = [
  <Route
    key="doctor"
    path="/doctor"
    element={<DoctorProtectedRoute><DoctorDashboard /></DoctorProtectedRoute>}
  />,
  <Route
    key="doctor-dashboard"
    path="/doctor/dashboard"
    element={<DoctorProtectedRoute><DoctorDashboard /></DoctorProtectedRoute>}
  />,
  <Route
    key="doctor-appointments"
    path="/doctor/appointments"
    element={<DoctorProtectedRoute><DoctorAppointments /></DoctorProtectedRoute>}
  />,
  <Route
    key="doctor-patients"
    path="/doctor/patients"
    element={<DoctorProtectedRoute><DoctorPatients /></DoctorProtectedRoute>}
  />,
  <Route
    key="doctor-consultations"
    path="/doctor/consultations"
    element={<DoctorProtectedRoute><DoctorConsultations /></DoctorProtectedRoute>}
  />,
  <Route
    key="doctor-records"
    path="/doctor/records"
    element={<DoctorProtectedRoute><DoctorRecords /></DoctorProtectedRoute>}
  />,
  <Route
    key="doctor-messages"
    path="/doctor/messages"
    element={<DoctorProtectedRoute><DoctorMessages /></DoctorProtectedRoute>}
  />,
  <Route
    key="doctor-settings"
    path="/doctor/settings"
    element={<DoctorProtectedRoute><DoctorSettings /></DoctorProtectedRoute>}
  />
];

export default DoctorRoutes; 
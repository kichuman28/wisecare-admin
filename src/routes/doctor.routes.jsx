import React from 'react';
import { Route } from 'react-router-dom';
import DoctorDashboard from '../doctor_panel/pages/dashboard/doctor_dashboard';
import DoctorAppointments from '../doctor_panel/pages/appointments/doctor_appointments';
import DoctorPatients from '../doctor_panel/pages/patients/doctor_patients';
import DoctorConsultations from '../doctor_panel/pages/consultations/doctor_consultations';
import DoctorRecords from '../doctor_panel/pages/records/doctor_records';
import DoctorMessages from '../doctor_panel/pages/messages/doctor_messages';
import DoctorSettings from '../doctor_panel/pages/settings/doctor_settings';

const DoctorRoutes = [
  <Route
    key="doctor"
    path="/doctor"
    element={<DoctorDashboard />}
  />,
  <Route
    key="doctor-dashboard"
    path="/doctor/dashboard"
    element={<DoctorDashboard />}
  />,
  <Route
    key="doctor-appointments"
    path="/doctor/appointments"
    element={<DoctorAppointments />}
  />,
  <Route
    key="doctor-patients"
    path="/doctor/patients"
    element={<DoctorPatients />}
  />,
  <Route
    key="doctor-consultations"
    path="/doctor/consultations"
    element={<DoctorConsultations />}
  />,
  <Route
    key="doctor-records"
    path="/doctor/records"
    element={<DoctorRecords />}
  />,
  <Route
    key="doctor-messages"
    path="/doctor/messages"
    element={<DoctorMessages />}
  />,
  <Route
    key="doctor-settings"
    path="/doctor/settings"
    element={<DoctorSettings />}
  />
];

export default DoctorRoutes; 
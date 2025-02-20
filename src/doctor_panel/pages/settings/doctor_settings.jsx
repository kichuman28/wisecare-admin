import React, { useState } from 'react';
import DoctorLayout from '../../components/layout/doctor_layout';
import { 
  UserCircleIcon,
  BellIcon,
  KeyIcon,
  ClockIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const DoctorSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // Sample doctor data
  const doctorData = {
    name: "Dr. Emily Wilson",
    email: "emily.wilson@example.com",
    phone: "+1 (555) 123-4567",
    specialization: "General Physician",
    experience: "15 years",
    education: "MD - Internal Medicine",
    address: "123 Medical Center, New York, NY",
    languages: ["English", "Spanish"],
    availability: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "15:00" }
    }
  };

  const menuItems = [
    { id: 'profile', name: 'Profile Settings', icon: UserCircleIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'availability', name: 'Availability', icon: ClockIcon },
    { id: 'billing', name: 'Billing & Payments', icon: CreditCardIcon },
    { id: 'documents', name: 'Documents', icon: DocumentTextIcon },
    { id: 'preferences', name: 'Preferences', icon: Cog6ToothIcon }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-2xl font-semibold">
                  {doctorData.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all">
                  Change Photo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={doctorData.name}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={doctorData.email}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  defaultValue={doctorData.phone}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  defaultValue={doctorData.specialization}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <input
                  type="text"
                  defaultValue={doctorData.experience}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <input
                  type="text"
                  defaultValue={doctorData.education}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  defaultValue={doctorData.address}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                <div className="flex flex-wrap gap-2">
                  {doctorData.languages.map((language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {language}
                    </span>
                  ))}
                  <button className="px-3 py-1 border border-dashed border-gray-300 text-gray-500 rounded-full text-sm hover:border-primary hover:text-primary transition-all">
                    + Add Language
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all">
                Save Changes
              </button>
            </div>
          </div>
        );

      case 'availability':
        return (
          <div className="space-y-6">
            <div className="grid gap-4">
              {Object.entries(doctorData.availability).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
                  <div className="capitalize font-medium text-gray-900">{day}</div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="time"
                      defaultValue={hours.start}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      defaultValue={hours.end}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all">
                Update Schedule
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Coming Soon</h3>
            <p className="mt-2 text-gray-500">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="mt-1 text-gray-600">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Settings Menu */}
          <div className="lg:w-64 bg-white rounded-xl shadow-sm border border-gray-100 h-fit">
            <div className="p-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorSettings; 
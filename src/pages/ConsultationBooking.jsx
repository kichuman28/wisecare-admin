import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import {
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChartBarIcon,
  PlusIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

const ConsultationBooking = () => {
  const [activeTab, setActiveTab] = useState('pending');
  
  // Sample data for demonstration
  const bookingRequests = {
    pending: [
      {
        id: 1,
        patientName: "Mrs. Sarah Johnson",
        age: 72,
        requestType: "Doctor Visit",
        specialization: "Cardiologist",
        priority: "High",
        timePreference: "Morning",
        status: "Pending",
        requestedDate: "2024-03-25",
        notes: "Regular heart checkup, prefers female doctor",
        timestamp: "2 hours ago"
      },
      {
        id: 2,
        patientName: "Mr. Robert Wilson",
        age: 68,
        requestType: "Lab Test",
        testType: "Complete Blood Work",
        priority: "Medium",
        timePreference: "Afternoon",
        status: "Processing",
        requestedDate: "2024-03-26",
        notes: "Fasting blood sugar test needed",
        timestamp: "4 hours ago"
      }
    ],
    active: [
      {
        id: 3,
        patientName: "Mr. James Anderson",
        age: 75,
        requestType: "Specialist",
        specialization: "Orthopedic",
        priority: "Medium",
        appointmentDate: "2024-03-24",
        appointmentTime: "10:30 AM",
        status: "Confirmed",
        location: "City Hospital",
        notes: "Follow-up for knee pain",
        timestamp: "1 day ago"
      }
    ]
  };

  const stats = [
    {
      title: "Total Requests",
      value: "128",
      change: "+12%",
      icon: UserGroupIcon,
      color: "blue"
    },
    {
      title: "Avg. Processing Time",
      value: "1.8 hrs",
      change: "-25%",
      icon: ClockIcon,
      color: "green"
    },
    {
      title: "Success Rate",
      value: "96%",
      change: "+3%",
      icon: CheckCircleIcon,
      color: "indigo"
    },
    {
      title: "Patient Satisfaction",
      value: "4.8/5",
      change: "+0.2",
      icon: StarIcon,
      color: "amber"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/50 p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <CalendarIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Consultation Booking</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and process booking requests efficiently</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
            <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all shadow-sm">
              <PlusIcon className="h-5 w-5 mr-2" />
              New Request
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                <span className="text-gray-600 text-sm ml-2">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'pending'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Pending Requests
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'active'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Active Bookings
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by patient name, request type, or status..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Request Cards */}
          <div className="p-6">
            <div className="space-y-4">
              {bookingRequests[activeTab].map((request) => (
                <div key={request.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {request.patientName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{request.patientName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {request.requestType} • Age: {request.age}
                        </p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {request.specialization || request.testType}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            request.priority === 'High' 
                              ? 'bg-red-50 text-red-700'
                              : 'bg-yellow-50 text-yellow-700'
                          }`}>
                            {request.priority} Priority
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{request.timestamp}</span>
                      <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <BellIcon className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Requested Date</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {request.requestedDate || request.appointmentDate}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Time Preference</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {request.timePreference || request.appointmentTime}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {request.status}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start">
                    <ExclamationCircleIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">{request.notes}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-4">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors">
                      {activeTab === 'pending' ? 'Process Request' : 'Manage Booking'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConsultationBooking; 
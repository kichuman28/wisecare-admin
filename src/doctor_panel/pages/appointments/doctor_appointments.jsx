import React, { useState } from 'react';
import DoctorLayout from '../../components/layout/doctor_layout';
import { CalendarIcon, ClockIcon, VideoCameraIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const DoctorAppointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'

  // Sample appointments data
  const appointments = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      time: "09:30 AM",
      type: "Video Consultation",
      status: "Confirmed",
      symptoms: "Frequent headaches and dizziness",
      isOnline: true
    },
    {
      id: 2,
      patientName: "Michael Brown",
      time: "11:00 AM",
      type: "In-Person",
      status: "Pending",
      symptoms: "Regular checkup",
      isOnline: false
    },
    {
      id: 3,
      patientName: "Emma Davis",
      time: "02:30 PM",
      type: "Phone Call",
      status: "Confirmed",
      symptoms: "Follow-up consultation",
      isOnline: true
    }
  ];

  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    for (let i = -15; i < 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short',
      day: 'numeric',
    }).format(date);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
              <p className="mt-1 text-gray-600">Manage your upcoming appointments and schedule</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button 
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  view === 'calendar' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Calendar View
              </button>
              <button 
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  view === 'list' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                List View
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Strip */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {generateCalendarDays().map((date, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center min-w-[80px] p-3 rounded-xl transition-all ${
                  isSelected(date)
                    ? 'bg-primary text-white'
                    : isToday(date)
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-sm font-medium">{formatDate(date).split(' ')[0]}</span>
                <span className="text-lg font-bold mt-1">{formatDate(date).split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {appointment.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{appointment.patientName}</h3>
                      <div className="mt-1 flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{appointment.time}</span>
                      </div>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === 'Confirmed' 
                            ? 'bg-green-50 text-green-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {appointment.status}
                        </span>
                        <span className="inline-flex items-center text-xs font-medium text-gray-600">
                          {appointment.isOnline ? (
                            appointment.type === 'Video Consultation' ? (
                              <VideoCameraIcon className="h-4 w-4 mr-1 text-blue-500" />
                            ) : (
                              <PhoneIcon className="h-4 w-4 mr-1 text-green-500" />
                            )
                          ) : (
                            <MapPinIcon className="h-4 w-4 mr-1 text-purple-500" />
                          )}
                          {appointment.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {appointment.isOnline ? (
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all">
                        {appointment.type === 'Video Consultation' ? 'Join Call' : 'Call Patient'}
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all">
                        View Details
                      </button>
                    )}
                  </div>
                </div>
                
                {appointment.symptoms && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">{appointment.symptoms}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorAppointments; 
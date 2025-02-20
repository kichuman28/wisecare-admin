import React, { useState } from 'react';
import DoctorLayout from '../../components/layout/doctor_layout';
import { 
  VideoCameraIcon, 
  MicrophoneIcon, 
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ClockIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const DoctorConsultations = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showChat, setShowChat] = useState(false);

  // Sample consultations data
  const consultations = {
    upcoming: [
      {
        id: 1,
        patientName: "Sarah Johnson",
        time: "10:30 AM Today",
        type: "Video Consultation",
        duration: "30 mins",
        reason: "Follow-up on medication",
        status: "Scheduled"
      },
      {
        id: 2,
        patientName: "Michael Brown",
        time: "2:00 PM Today",
        type: "Video Consultation",
        duration: "45 mins",
        reason: "Diabetes checkup",
        status: "Scheduled"
      }
    ],
    past: [
      {
        id: 3,
        patientName: "Emma Davis",
        date: "Feb 15, 2024",
        type: "Video Consultation",
        duration: "30 mins",
        diagnosis: "Prescribed new medication for blood pressure",
        status: "Completed"
      },
      {
        id: 4,
        patientName: "James Wilson",
        date: "Feb 14, 2024",
        type: "Video Consultation",
        duration: "45 mins",
        diagnosis: "Regular checkup, condition stable",
        status: "Completed"
      }
    ]
  };

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Consultations</h1>
              <p className="mt-1 text-gray-600">Manage your video consultations and appointments</p>
            </div>
            <button className="mt-4 md:mt-0 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all flex items-center space-x-2">
              <VideoCameraIcon className="h-5 w-5" />
              <span>Start New Consultation</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Consultation List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'upcoming'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'past'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Past
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {consultations[activeTab].map((consultation) => (
                <div key={consultation.id} className="p-4 hover:bg-gray-50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {consultation.patientName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{consultation.patientName}</h3>
                        <div className="mt-1 flex items-center space-x-2">
                          <ClockIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {activeTab === 'upcoming' ? consultation.time : consultation.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    {activeTab === 'upcoming' && (
                      <button className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary-hover transition-all">
                        Join
                      </button>
                    )}
                  </div>
                  <div className="mt-3 flex items-center space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {consultation.type}
                    </span>
                    <span className="text-sm text-gray-500">{consultation.duration}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {activeTab === 'upcoming' ? consultation.reason : consultation.diagnosis}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Video Consultation Area */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="aspect-video bg-gray-900 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <VideoCameraIcon className="h-16 w-16 text-gray-500 mx-auto" />
                  <p className="mt-4 text-gray-400">No active consultation</p>
                  <p className="text-sm text-gray-500">Join a consultation to start video call</p>
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4">
                <button className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-all">
                  <MicrophoneIcon className="h-6 w-6" />
                </button>
                <button className="p-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-all">
                  <VideoCameraIcon className="h-6 w-6" />
                </button>
                <button className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all">
                  <PhoneIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Patient Preview */}
              <div className="absolute bottom-6 right-6 w-48 aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Consultation Tools */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setShowChat(!showChat)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Chat</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all">
                    <DocumentTextIcon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Notes</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Duration: 00:00:00</span>
                </div>
              </div>
            </div>

            {/* Chat Sidebar */}
            {showChat && (
              <div className="absolute right-0 top-0 h-full w-80 bg-white border-l border-gray-100 shadow-lg">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Chat</h3>
                  <button 
                    onClick={() => setShowChat(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-center text-sm text-gray-500">No messages yet</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorConsultations; 
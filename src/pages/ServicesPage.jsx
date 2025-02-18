import { useState } from 'react';
import Layout from '../components/layout/Layout';
import {
  WrenchScrewdriverIcon,
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const ServicesPage = () => {
  const [services] = useState([
    {
      id: 1,
      type: 'Medical Checkup',
      provider: 'Dr. John Smith',
      client: 'Robert Johnson',
      status: 'Scheduled',
      date: '2024-03-20',
      time: '10:00 AM',
      location: 'Home Visit',
      notes: 'Regular monthly checkup'
    },
    {
      id: 2,
      type: 'Physical Therapy',
      provider: 'Sarah Wilson',
      client: 'Jane Smith',
      status: 'In Progress',
      date: '2024-03-18',
      time: '2:30 PM',
      location: 'Therapy Center',
      notes: 'Follow-up session'
    },
    {
      id: 3,
      type: 'Medication Review',
      provider: 'Dr. Emily Brown',
      client: 'John Doe',
      status: 'Completed',
      date: '2024-03-15',
      time: '11:15 AM',
      location: 'Video Call',
      notes: 'Quarterly medication review'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-gray-600 mr-3" />
            <h1 className="text-2xl font-semibold text-gray-800">Services</h1>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <PlusIcon className="h-5 w-5 mr-2" />
            Schedule Service
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search services..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Types</option>
              <option value="medical">Medical Checkup</option>
              <option value="therapy">Physical Therapy</option>
              <option value="medication">Medication Review</option>
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">{service.type}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                        <div>
                          <p className="font-medium">Provider</p>
                          <p>{service.provider}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                        <div>
                          <p className="font-medium">Client</p>
                          <p>{service.client}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                        <div>
                          <p className="font-medium">Date & Time</p>
                          <p>{new Date(service.date).toLocaleDateString()} at {service.time}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p>{service.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {service.notes && (
                    <div className="mt-4 text-sm text-gray-600">
                      <p className="font-medium">Notes</p>
                      <p>{service.notes}</p>
                    </div>
                  )}
                </div>

                <div className="ml-6 flex flex-col items-end space-y-2">
                  {getStatusIcon(service.status)}
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ServicesPage; 
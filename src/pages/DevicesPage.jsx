import { useState } from 'react';
import Layout from '../components/layout/Layout';
import {
  ComputerDesktopIcon,
  PlusIcon,
  BoltIcon,
  SignalIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const DevicesPage = () => {
  const [devices] = useState([
    {
      id: 1,
      name: 'Fall Detector',
      type: 'Wearable',
      assignedTo: 'John Doe',
      status: 'Online',
      battery: 85,
      lastPing: '2 minutes ago',
      location: 'Living Room'
    },
    {
      id: 2,
      name: 'Heart Rate Monitor',
      type: 'Medical',
      assignedTo: 'Jane Smith',
      status: 'Online',
      battery: 92,
      lastPing: '1 minute ago',
      location: 'Bedroom'
    },
    {
      id: 3,
      name: 'Emergency Button',
      type: 'Safety',
      assignedTo: 'Robert Johnson',
      status: 'Offline',
      battery: 15,
      lastPing: '3 hours ago',
      location: 'Kitchen'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBatteryColor = (level) => {
    if (level > 60) return 'text-green-500';
    if (level > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <ComputerDesktopIcon className="h-8 w-8 text-gray-600 mr-3" />
            <h1 className="text-2xl font-semibold text-gray-800">Devices</h1>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Device
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search devices..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Types</option>
              <option value="wearable">Wearable</option>
              <option value="medical">Medical</option>
              <option value="safety">Safety</option>
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>

        {/* Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div key={device.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{device.name}</h3>
                  <p className="text-sm text-gray-500">{device.type}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(device.status)}`}>
                  {device.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <BoltIcon className={`h-5 w-5 mr-2 ${getBatteryColor(device.battery)}`} />
                  <span>{device.battery}% Battery</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <SignalIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>Last ping: {device.lastPing}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{device.location}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>Assigned to: {device.assignedTo}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="w-full px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DevicesPage; 
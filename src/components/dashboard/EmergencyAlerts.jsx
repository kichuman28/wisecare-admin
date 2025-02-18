import React from 'react';
import { 
  BellAlertIcon, 
  UserIcon, 
  MapPinIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const EmergencyAlerts = () => {
  const alerts = [
    {
      id: 1,
      user: 'John Doe',
      location: '123 Main St, Apt 4B',
      time: '2 minutes ago',
      status: 'pending'
    },
    {
      id: 2,
      user: 'Sarah Smith',
      location: '456 Park Ave',
      time: '5 minutes ago',
      status: 'assigned'
    },
    {
      id: 3,
      user: 'Robert Johnson',
      location: '789 Oak Rd',
      time: '10 minutes ago',
      status: 'resolved'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-red-600 bg-red-100';
      case 'assigned':
        return 'text-yellow-600 bg-yellow-100';
      case 'resolved':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BellAlertIcon className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-lg font-medium text-primary">Emergency Alerts</h2>
        </div>
        <a 
          href="/sos-alerts" 
          className="text-sm text-primary-hover hover:text-primary flex items-center"
        >
          View all
          <ArrowRightIcon className="h-4 w-4 ml-1" />
        </a>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-light/20 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{alert.user}</p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alert.status)}`}>
                  {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {alert.location}
                </div>
                <div className="flex items-center mt-1">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {alert.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyAlerts; 
import React from 'react';
import { 
  UserIcon, 
  BellAlertIcon, 
  DevicePhoneMobileIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'sos',
      user: 'John Doe',
      action: 'triggered an SOS alert',
      time: '5 minutes ago',
      icon: BellAlertIcon,
      iconClass: 'text-red-600 bg-red-100'
    },
    {
      id: 2,
      type: 'user',
      user: 'Sarah Smith',
      action: 'registered as a new user',
      time: '10 minutes ago',
      icon: UserIcon,
      iconClass: 'text-primary bg-primary-light/20'
    },
    {
      id: 3,
      type: 'device',
      user: 'Robert Johnson',
      action: 'added a new device',
      time: '15 minutes ago',
      icon: DevicePhoneMobileIcon,
      iconClass: 'text-primary bg-primary-light/20'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-medium text-primary mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 sm:space-x-4">
            <div className={`p-2 rounded-lg flex-shrink-0 ${activity.iconClass}`}>
              <activity.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 break-words">
                <span className="text-primary">{activity.user}</span>{' '}
                <span className="text-gray-600">{activity.action}</span>
              </p>
              <div className="flex items-center mt-1 text-xs sm:text-sm text-gray-500">
                <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity; 
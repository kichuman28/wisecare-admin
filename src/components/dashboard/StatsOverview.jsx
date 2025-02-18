import React from 'react';
import {
  UserGroupIcon,
  DevicePhoneMobileIcon,
  BellAlertIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const StatsOverview = () => {
  const stats = [
    {
      id: 1,
      name: 'Total Users',
      value: '2,345',
      icon: UserGroupIcon,
      change: '+5.25%',
      timeframe: 'from last month'
    },
    {
      id: 2,
      name: 'Active Devices',
      value: '1,234',
      icon: DevicePhoneMobileIcon,
      change: '+3.2%',
      timeframe: 'from last month'
    },
    {
      id: 3,
      name: 'SOS Alerts',
      value: '15',
      icon: BellAlertIcon,
      change: '-2.1%',
      timeframe: 'from last month'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div key={stat.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-primary-light/10">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-semibold text-primary">{stat.value}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-gray-600">{stat.timeframe}</span>
            <span className={`ml-2 ${
              stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview; 
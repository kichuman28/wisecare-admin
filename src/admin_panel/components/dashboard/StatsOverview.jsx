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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {stats.map((stat) => (
        <div key={stat.id} className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 md:p-3 rounded-lg bg-primary-light/10">
              <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div className="ml-3 md:ml-4 min-w-0">
              <p className="text-sm font-medium text-gray-600 truncate">{stat.name}</p>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold text-primary">{stat.value}</p>
            </div>
          </div>
          <div className="mt-3 md:mt-4 flex flex-wrap items-center gap-2 text-xs md:text-sm">
            <div className="flex items-center">
              <ClockIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-400 mr-1" />
              <span className="text-gray-600">{stat.timeframe}</span>
            </div>
            <span className={`${
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
import React from 'react';
import { 
  HeartIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon 
} from '@heroicons/react/24/outline';

const HealthStats = () => {
  const stats = [
    {
      id: 1,
      name: 'Average Heart Rate',
      value: '72',
      unit: 'bpm',
      change: '+2.3%',
      trend: 'up'
    },
    {
      id: 2,
      name: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      change: '-1.5%',
      trend: 'down'
    },
    {
      id: 3,
      name: 'Blood Oxygen',
      value: '98',
      unit: '%',
      change: '+0.5%',
      trend: 'up'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <HeartIcon className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-lg font-medium text-primary">Health Statistics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="p-4 rounded-lg bg-primary-light/10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              {stat.trend === 'up' ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-primary">{stat.value}</p>
              <p className="ml-1 text-sm text-gray-600">{stat.unit}</p>
            </div>
            <div className="mt-2">
              <span className={`text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">from last check</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthStats; 
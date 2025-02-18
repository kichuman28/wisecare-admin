import React from 'react';
import { 
  UserPlusIcon, 
  DevicePhoneMobileIcon, 
  DocumentPlusIcon 
} from '@heroicons/react/24/outline';

const QuickActions = () => {
  const actions = [
    {
      name: 'Add User',
      icon: UserPlusIcon,
      href: '/users'
    },
    {
      name: 'Register Device',
      icon: DevicePhoneMobileIcon,
      href: '/devices'
    },
    {
      name: 'New Report',
      icon: DocumentPlusIcon,
      href: '/reports'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-medium text-primary mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {actions.map((action) => (
          <a
            key={action.name}
            href={action.href}
            className="flex items-center p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-primary-light hover:bg-primary-light/5 transition-colors group"
          >
            <action.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-hover group-hover:text-primary transition-colors" />
            <span className="ml-3 text-sm sm:text-base text-gray-900 group-hover:text-primary">{action.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickActions; 
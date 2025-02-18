import { useState } from 'react';
import {
  HomeIcon,
  UserGroupIcon,
  HeartIcon,
  CalendarIcon,
  BellAlertIcon,
  TruckIcon,
  MapIcon,
  ChatBubbleBottomCenterTextIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon },
    { name: 'Users', icon: UserGroupIcon },
    { name: 'Health Monitor', icon: HeartIcon },
    { name: 'Appointments', icon: CalendarIcon },
    { name: 'Emergency Alerts', icon: BellAlertIcon },
    { name: 'Deliveries', icon: TruckIcon },
    { name: 'Location Tracking', icon: MapIcon },
    { name: 'AI Companion', icon: ChatBubbleBottomCenterTextIcon },
    { name: 'Settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="fixed h-full w-72 bg-white shadow-lg border-r border-gray-100">
      <div className="p-6">
        <h1 className="text-teal-600 text-3xl font-bold flex items-center">
          <HeartIcon className="h-8 w-8 mr-2" />
          WiseCare
        </h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`flex items-center px-6 py-3.5 cursor-pointer transition-all duration-200 ${
              activeItem === item.name
                ? 'bg-teal-50 text-teal-600 border-r-4 border-teal-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'
            }`}
            onClick={() => setActiveItem(item.name)}
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 
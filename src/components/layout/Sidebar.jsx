import { useState } from 'react';
import {
  HomeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  BellIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon },
    { name: 'Users', icon: UserGroupIcon },
    { name: 'Devices', icon: ComputerDesktopIcon },
    { name: 'Alerts', icon: BellIcon },
    { name: 'Content', icon: DocumentTextIcon },
    { name: 'Services', icon: WrenchScrewdriverIcon },
    { name: 'Reports', icon: ChartBarIcon },
    { name: 'Settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="fixed h-full w-64 bg-[#1E2837] text-white">
      <nav className="mt-6 px-3">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`flex items-center px-4 py-2.5 mb-1 cursor-pointer rounded-lg transition-colors ${
              activeItem === item.name
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
            onClick={() => setActiveItem(item.name)}
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span className="text-sm">{item.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 
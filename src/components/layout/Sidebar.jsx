import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  BellIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  ComputerDesktopIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { name: 'SOS Alerts', icon: BellIcon, path: '/sos-alerts' },
    { name: 'Users', icon: UserGroupIcon, path: '/users' },
    { name: 'Devices', icon: ComputerDesktopIcon, path: '/devices' },
    { name: 'Content', icon: DocumentTextIcon, path: '/content' },
    { name: 'Services', icon: WrenchScrewdriverIcon, path: '/services' },
    { name: 'Reports', icon: ChartBarIcon, path: '/reports' },
    { name: 'Settings', icon: Cog6ToothIcon, path: '/settings', hasDropdown: true }
  ];

  const handleNavigation = (item) => {
    if (item.hasDropdown) {
      setShowSettingsDropdown(!showSettingsDropdown);
    } else {
      navigate(item.path);
      setShowSettingsDropdown(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="fixed h-full w-64 bg-[#1E2837] text-white">
      <nav className="mt-6 px-3">
        {menuItems.map((item) => (
          <div key={item.name}>
            <div
              className={`flex items-center px-4 py-2.5 mb-1 cursor-pointer rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
              onClick={() => handleNavigation(item)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="text-sm">{item.name}</span>
            </div>

            {/* Settings Dropdown */}
            {item.name === 'Settings' && showSettingsDropdown && (
              <div className="ml-12 mt-1 space-y-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg w-full"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  BellIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  ComputerDesktopIcon,
  ArrowRightOnRectangleIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { name: 'SOS Alerts', icon: BellIcon, path: '/sos-alerts' },
    { name: 'Users', icon: UserGroupIcon, path: '/users' },
    { name: 'Devices', icon: ComputerDesktopIcon, path: '/devices' },
    { name: 'Content', icon: DocumentTextIcon, path: '/content' },
    { name: 'Services', icon: WrenchScrewdriverIcon, path: '/services' },
    { name: 'Video Analysis', icon: VideoCameraIcon, path: '/video-analysis' },
    { name: 'Reports', icon: ChartBarIcon, path: '/reports' },
    { name: 'Settings', icon: Cog6ToothIcon, path: '/settings' }
  ];

  const handleNavigation = (item) => {
    navigate(item.path);
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
    <div className="fixed h-full w-64 bg-primary text-white flex flex-col">
      <nav className="flex-1 mt-6 px-3">
        <div className="space-y-1.5">
          {menuItems.map((item) => (
            <div key={item.name} className="relative">
              <div
                className={`group flex items-center px-4 py-2.5 rounded-lg transition-all duration-300 ease-in-out cursor-pointer
                  ${location.pathname === item.path
                    ? 'bg-primary-hover text-white shadow-lg shadow-primary-light/20'
                    : 'text-white hover:bg-primary-light/20 hover:text-white'
                  }
                  ${hoveredItem === item.name ? 'scale-[1.02] transform' : ''}
                `}
                onClick={() => handleNavigation(item)}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="relative flex items-center w-full">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
                    ${location.pathname === item.path ? 'bg-primary-light/20' : 'group-hover:bg-primary-light/10'}
                  `}>
                    <item.icon className={`h-5 w-5 transition-transform duration-300 ${
                      hoveredItem === item.name ? 'scale-110' : ''
                    }`} />
                  </div>
                  <span className="ml-3 text-sm font-medium">{item.name}</span>
                  
                  {/* Active indicator */}
                  {location.pathname === item.path && (
                    <div className="absolute left-0 w-1 h-full bg-white rounded-r-full transform -translate-x-4" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Logout button at bottom */}
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2.5 text-sm text-white hover:text-white hover:bg-primary-light/20 rounded-lg transition-all duration-300 ease-in-out group"
          onMouseEnter={() => setHoveredItem('logout')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
            group-hover:bg-primary-light/10
          `}>
            <ArrowRightOnRectangleIcon className={`h-5 w-5 transition-transform duration-300 ${
              hoveredItem === 'logout' ? 'translate-x-1' : ''
            }`} />
          </div>
          <span className="ml-3 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 
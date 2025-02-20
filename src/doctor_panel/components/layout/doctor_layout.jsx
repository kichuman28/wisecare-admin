import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import {
  CalendarIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const DoctorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userData, logout } = useAuth();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const doctorDoc = await getDocs(query(
          collection(db, 'doctors'),
          where('uid', '==', user.uid)
        ));

        if (!doctorDoc.empty) {
          setDoctorDetails(doctorDoc.docs[0].data());
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
    };

    if (user) {
      fetchDoctorDetails();
    }
  }, [user]);

  const menuItems = [
    { name: 'Dashboard', icon: ChartBarIcon, path: '/doctor/dashboard' },
    { name: 'Appointments', icon: CalendarIcon, path: '/doctor/appointments' },
    { name: 'Patients', icon: UserGroupIcon, path: '/doctor/patients' },
    { name: 'Consultations', icon: VideoCameraIcon, path: '/doctor/consultations' },
    { name: 'Medical Records', icon: ClipboardDocumentCheckIcon, path: '/doctor/records' },
    { name: 'Messages', icon: ChatBubbleLeftRightIcon, path: '/doctor/messages' },
    { name: 'Settings', icon: Cog6ToothIcon, path: '/doctor/settings' }
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

  // Get doctor's initials
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="fixed h-full w-64 bg-white shadow-lg border-r border-gray-100">
      {/* Doctor Profile Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold text-lg">
              {getInitials(doctorDetails?.name || userData?.name)}
            </span>
          </div>
          <div>
            <h2 className="text-gray-900 font-semibold">{doctorDetails?.name || userData?.name}</h2>
            <p className="text-sm text-gray-500">{doctorDetails?.specialization || 'Doctor'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 mt-6 px-3">
        <div className="space-y-1.5">
          {menuItems.map((item) => (
            <div key={item.name} className="relative">
              <div
                className={`group flex items-center px-4 py-2.5 rounded-lg transition-all duration-300 ease-in-out cursor-pointer
                  ${location.pathname === item.path
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
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
                    ${location.pathname === item.path ? 'bg-white/20' : 'group-hover:bg-primary/10'}
                  `}>
                    <item.icon className={`h-5 w-5 transition-transform duration-300 ${
                      hoveredItem === item.name ? 'scale-110' : ''
                    }`} />
                  </div>
                  <span className="ml-3 text-sm font-medium">{item.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Logout button */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2.5 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-all duration-300 ease-in-out group"
          onMouseEnter={() => setHoveredItem('logout')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg group-hover:bg-primary/10">
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

const DoctorLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isSidebarOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full transform transition-transform duration-300 ease-in-out lg:translate-x-0 z-50 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <DoctorSidebar />
      </div>

      {/* Main content */}
      <div className="lg:ml-64 transition-all duration-300">
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DoctorLayout; 
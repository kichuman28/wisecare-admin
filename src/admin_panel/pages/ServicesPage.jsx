import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { 
  WrenchScrewdriverIcon, 
  PlusIcon,
  CalendarIcon,
  TruckIcon,
  UserGroupIcon,
  ChartBarSquareIcon,
  DeviceTabletIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  Cog6ToothIcon,
  BellIcon,
  ArrowPathIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

const services = [
  {
    id: 1,
    name: 'Consultation Booking',
    description: 'Schedule in-person or telehealth consultations with healthcare professionals. Features include instant booking, reminder system, and flexible rescheduling options.',
    status: 'active',
    icon: CalendarIcon,
    stats: {
      bookings: '250+',
      satisfaction: '98%'
    },
    activeUsers: 180,
    trend: '+12%',
    color: 'indigo'
  },
  {
    id: 2,
    name: 'Medication & Grocery Delivery',
    description: 'Doorstep delivery of medications, groceries, and essential items. Set up recurring orders and get real-time delivery tracking.',
    status: 'active',
    icon: TruckIcon,
    stats: {
      deliveries: '1000+',
      accuracy: '99.9%'
    },
    activeUsers: 320,
    trend: '+25%',
    color: 'emerald'
  },
  {
    id: 3,
    name: 'Personal Assistance Services',
    description: 'Connect with trained assistants for daily activities including meal preparation, cleaning, and companionship. All assistants are background-verified.',
    status: 'active',
    icon: UserGroupIcon,
    stats: {
      assistants: '100+',
      rating: '4.8/5'
    },
    activeUsers: 150,
    trend: '+8%',
    color: 'blue'
  },
  {
    id: 4,
    name: 'Health Monitoring Dashboard',
    description: 'Real-time health metrics monitoring for family members. View vital signs, activity levels, and receive instant alerts for any concerning changes.',
    status: 'active',
    icon: ChartBarSquareIcon,
    stats: {
      users: '500+',
      uptime: '99.9%'
    },
    activeUsers: 450,
    trend: '+30%',
    color: 'violet'
  },
  {
    id: 5,
    name: 'IoT Health Integration',
    description: 'Advanced health tracking through IoT devices. Includes smart cameras, pulse monitors, and fall detection with consent-based monitoring.',
    status: 'active',
    icon: DeviceTabletIcon,
    stats: {
      devices: '1000+',
      alerts: '24/7'
    },
    activeUsers: 280,
    trend: '+15%',
    color: 'rose'
  }
];

const ServicesPage = () => {
  const navigate = useNavigate();
  const totalActiveUsers = services.reduce((sum, service) => sum + service.activeUsers, 0);

  const handleServiceClick = (serviceName) => {
    switch(serviceName.toLowerCase()) {
      case 'consultation booking':
        navigate('/services/consultation-booking');
        break;
      case 'medication & grocery delivery':
        navigate('/services/medication-delivery');
        break;
      // Add other service routes as they become available
      default:
        break;
    }
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6 space-y-8 bg-gray-50/50">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <div className="p-2.5 bg-primary/10 rounded-lg mr-4">
              <WrenchScrewdriverIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">WiseCare Services</h1>
              <p className="text-sm text-gray-600 mt-1">Empowering healthcare through innovation</p>
            </div>
          </div>
          <button className="flex items-center px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all shadow-sm hover:shadow-md">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Service
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            const colorClasses = {
              indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-200',
              emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-200',
              blue: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-200',
              violet: 'bg-violet-50 text-violet-600 border-violet-100 hover:border-violet-200',
              rose: 'bg-rose-50 text-rose-600 border-rose-100 hover:border-rose-200'
            };

            return (
              <div 
                key={service.id} 
                className={`relative group rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-lg cursor-pointer ${colorClasses[service.color]}`}
                onClick={() => handleServiceClick(service.name)}
              >
                <div className="absolute top-4 right-4">
                  <button className="p-2 rounded-lg bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                    <Cog6ToothIcon className={`h-5 w-5 ${colorClasses[service.color].split(' ')[1]}`} />
                  </button>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${colorClasses[service.color].split(' ')[0]}`}>
                    <Icon className={`h-7 w-7 ${colorClasses[service.color].split(' ')[1]}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{service.description}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  {Object.entries(service.stats).map(([key, value]) => (
                    <div key={key} className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className={`text-lg font-semibold mt-1 ${colorClasses[service.color].split(' ')[1]}`}>{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">{service.activeUsers} active users</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowTrendingUpIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{service.trend}</span>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/50 to-transparent rounded-b-2xl -z-10"></div>
              </div>
            );
          })}
        </div>

        {/* Analytics Teaser */}
        <div className="mt-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ChartPieIcon className="h-6 w-6 text-primary" />
                Service Analytics
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Total active users across all services: <span className="font-semibold text-primary">{totalActiveUsers}</span>
              </p>
            </div>
            <button className="text-primary hover:text-primary-hover font-medium text-sm transition-colors">
              View detailed analytics →
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServicesPage; 
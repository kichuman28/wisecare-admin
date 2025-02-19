import React from 'react';
import Layout from '../components/layout/Layout';
import { HomeIcon } from '@heroicons/react/24/outline';
import StatsOverview from '../components/dashboard/StatsOverview';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';

const Dashboard = () => {
  return (
    <Layout>
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center mb-4 md:mb-6">
          <HomeIcon className="h-6 w-6 md:h-8 md:w-8 text-primary mr-2 md:mr-3" />
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Stats Cards */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm sm:text-base md:text-lg font-medium text-primary mb-1 sm:mb-2">Active Users</h3>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-hover">2,345</p>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm sm:text-base md:text-lg font-medium text-primary mb-1 sm:mb-2">Active Devices</h3>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-hover">1,234</p>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm sm:text-base md:text-lg font-medium text-primary mb-1 sm:mb-2">SOS Alerts</h3>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-hover">15</p>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <StatsOverview />
          <RecentActivity />
        </div>

        <div className="mt-4 sm:mt-6">
          <QuickActions />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 
import React from 'react';
import Layout from '../components/layout/Layout';
import { HomeIcon } from '@heroicons/react/24/outline';
import StatsOverview from '../components/dashboard/StatsOverview';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';

const Dashboard = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <HomeIcon className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-primary mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-primary-hover">2,345</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-primary mb-2">Active Devices</h3>
            <p className="text-3xl font-bold text-primary-hover">1,234</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-primary mb-2">SOS Alerts</h3>
            <p className="text-3xl font-bold text-primary-hover">15</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 
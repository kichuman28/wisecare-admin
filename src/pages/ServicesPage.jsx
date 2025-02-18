import React from 'react';
import Layout from '../components/layout/Layout';
import { WrenchScrewdriverIcon, PlusIcon } from '@heroicons/react/24/outline';

const ServicesPage = () => {
  return (
    <Layout>
      <div className="p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Services</h1>
          </div>
          <button 
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors w-full sm:w-auto"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Service
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search services..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover"
                />
              </div>
              <div className="w-full sm:w-auto">
                <select className="w-full sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="border rounded-lg p-4 sm:p-6 hover:border-primary-light transition-colors">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                    <h3 className="text-lg font-medium text-primary break-words pr-2">{`Service ${item}`}</h3>
                    <span className="bg-primary-light/20 text-primary px-2 py-1 rounded-full text-xs w-fit">
                      Active
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm sm:text-base">Service description goes here. This is a brief overview of what this service provides.</p>
                  <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                    <div className="text-xs sm:text-sm text-gray-500">
                      Last updated: 2024-02-18
                    </div>
                    <div className="flex space-x-4">
                      <button className="text-primary-hover hover:text-primary text-sm sm:text-base">Edit</button>
                      <button className="text-red-500 hover:text-red-700 text-sm sm:text-base">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServicesPage; 
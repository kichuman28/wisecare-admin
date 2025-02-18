import React from 'react';
import Layout from '../components/layout/Layout';
import { WrenchScrewdriverIcon, PlusIcon } from '@heroicons/react/24/outline';

const ServicesPage = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-2xl font-semibold text-gray-800">Services</h1>
          </div>
          <button 
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Service
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search services..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover"
                />
              </div>
              <div className="ml-4">
                <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="border rounded-lg p-6 hover:border-primary-light transition-colors">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-primary">Service {item}</h3>
                    <span className="bg-primary-light/20 text-primary px-2 py-1 rounded-full text-xs">
                      Active
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">Service description goes here. This is a brief overview of what this service provides.</p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Last updated: 2024-02-18
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-primary-hover hover:text-primary">Edit</button>
                      <button className="text-red-500 hover:text-red-700">Delete</button>
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
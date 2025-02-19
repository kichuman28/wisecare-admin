import React from 'react';
import Layout from '../components/layout/Layout';
import { ComputerDesktopIcon, PlusIcon } from '@heroicons/react/24/outline';

const DevicesPage = () => {
  return (
    <Layout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center">
            <ComputerDesktopIcon className="h-6 w-6 md:h-8 md:w-8 text-primary mr-2 md:mr-3" />
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Devices</h1>
          </div>
          <button 
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors w-full sm:w-auto"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Device
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search devices..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover"
                />
              </div>
              <div className="w-full sm:w-auto">
                <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            {/* Devices Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="border rounded-lg p-4 md:p-6 hover:border-primary-light transition-colors">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base md:text-lg font-medium text-primary">Device {item}</h3>
                    <span className="bg-primary-light/20 text-primary px-2 py-1 rounded-full text-xs">
                      Active
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Device ID:</span>
                      <span className="text-gray-900">DEV-{item}234</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="text-gray-900">Fall Detector</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Active:</span>
                      <span className="text-gray-900">2 mins ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Battery:</span>
                      <span className="text-gray-900">85%</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-6 flex justify-end space-x-3">
                    <button className="text-sm text-primary-hover hover:text-primary transition-colors">Configure</button>
                    <button className="text-sm text-red-500 hover:text-red-700 transition-colors">Remove</button>
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

export default DevicesPage; 
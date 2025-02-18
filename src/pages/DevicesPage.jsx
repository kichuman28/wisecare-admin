import React from 'react';
import Layout from '../components/layout/Layout';
import { ComputerDesktopIcon, PlusIcon } from '@heroicons/react/24/outline';

const DevicesPage = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <ComputerDesktopIcon className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-2xl font-semibold text-gray-800">Devices</h1>
          </div>
          <button 
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Device
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search devices..."
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

            {/* Devices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="border rounded-lg p-6 hover:border-primary-light transition-colors">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-primary">Device {item}</h3>
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
                  <div className="mt-6 flex justify-end space-x-2">
                    <button className="text-primary-hover hover:text-primary">Configure</button>
                    <button className="text-red-500 hover:text-red-700">Remove</button>
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
import React from 'react';
import Layout from '../components/layout/Layout';
import { ChartBarIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const ReportsPage = () => {
  // User Activity Data
  const userActivityData = [
    { month: 'Jan', activeUsers: 2100, newUsers: 400 },
    { month: 'Feb', activeUsers: 2400, newUsers: 450 },
    { month: 'Mar', activeUsers: 2200, newUsers: 420 },
    { month: 'Apr', activeUsers: 2800, newUsers: 500 },
    { month: 'May', activeUsers: 3100, newUsers: 550 },
    { month: 'Jun', activeUsers: 3400, newUsers: 600 }
  ];

  // SOS Alerts Data
  const alertsData = [
    { date: '1', alerts: 12, responseTime: 4.2 },
    { date: '2', alerts: 19, responseTime: 3.8 },
    { date: '3', alerts: 15, responseTime: 4.5 },
    { date: '4', alerts: 21, responseTime: 3.2 },
    { date: '5', alerts: 18, responseTime: 3.9 },
    { date: '6', alerts: 24, responseTime: 3.1 },
    { date: '7', alerts: 16, responseTime: 3.6 }
  ];

  // Device Distribution Data
  const deviceData = [
    { name: 'Fall Detectors', value: 35, color: '#2D336B' },
    { name: 'Heart Monitors', value: 25, color: '#7886C7' },
    { name: 'Emergency Buttons', value: 20, color: '#A9B5DF' },
    { name: 'Motion Sensors', value: 15, color: '#B4BDEA' },
    { name: 'Other Devices', value: 5, color: '#C3CAF5' }
  ];

  // Alert Types Distribution
  const alertTypesData = [
    { name: 'Falls', value: 40 },
    { name: 'Heart Rate', value: 25 },
    { name: 'Manual SOS', value: 20 },
    { name: 'Inactivity', value: 15 }
  ];

  return (
    <Layout>
      <div className="p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Analytics Dashboard</h1>
          </div>
          <button 
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors w-full sm:w-auto"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export Reports
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* User Activity Chart */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-medium text-primary mb-4">User Activity</h2>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="activeUsers" 
                    name="Active Users"
                    stroke="#2D336B" 
                    fill="#2D336B" 
                    fillOpacity={0.1}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="newUsers" 
                    name="New Users"
                    stroke="#7886C7" 
                    fill="#7886C7" 
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SOS Alerts Chart */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-medium text-primary mb-4">SOS Alerts Overview</h2>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={alertsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="alerts" 
                    name="Number of Alerts"
                    stroke="#2D336B" 
                    strokeWidth={2}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="responseTime" 
                    name="Avg Response Time (min)"
                    stroke="#7886C7" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Device Distribution Chart */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-medium text-primary mb-4">Device Distribution</h2>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alert Types Chart */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-medium text-primary mb-4">Alert Types Distribution</h2>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertTypesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar 
                    dataKey="value" 
                    name="Percentage" 
                    fill="#2D336B"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Reports Table */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:col-span-2">
            <h2 className="text-base sm:text-lg font-medium text-primary mb-4">Recent Reports</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { name: 'Monthly Activity Summary', date: '2024-03-01', type: 'Analytics' },
                    { name: 'User Engagement Report', date: '2024-03-01', type: 'Analytics' },
                    { name: 'Emergency Response Times', date: '2024-02-29', type: 'Performance' }
                  ].map((report, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-normal sm:whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {report.name}
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.date}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="bg-primary-light/20 text-primary px-2 py-1 rounded-full text-xs">
                          {report.type}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm">
                        <button className="text-primary-hover hover:text-primary">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage; 
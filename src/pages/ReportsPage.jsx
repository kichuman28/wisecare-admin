import { useState } from 'react';
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
  Cell
} from 'recharts';

const ReportsPage = () => {
  // Sample data for charts
  const alertsData = [
    { month: 'Jan', alerts: 12 },
    { month: 'Feb', alerts: 19 },
    { month: 'Mar', alerts: 15 },
    { month: 'Apr', alerts: 21 },
    { month: 'May', alerts: 18 },
    { month: 'Jun', alerts: 24 }
  ];

  const deviceUsageData = [
    { name: 'Fall Detector', value: 35 },
    { name: 'Heart Monitor', value: 25 },
    { name: 'Emergency Button', value: 20 },
    { name: 'Motion Sensor', value: 15 },
    { name: 'Other', value: 5 }
  ];

  const userActivityData = [
    { day: 'Mon', active: 45, inactive: 15 },
    { day: 'Tue', active: 50, inactive: 10 },
    { day: 'Wed', active: 48, inactive: 12 },
    { day: 'Thu', active: 52, inactive: 8 },
    { day: 'Fri', active: 47, inactive: 13 },
    { day: 'Sat', active: 43, inactive: 17 },
    { day: 'Sun', active: 40, inactive: 20 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-gray-600 mr-3" />
            <h1 className="text-2xl font-semibold text-gray-800">Reports & Analytics</h1>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { title: 'Total Users', value: '1,234', change: '+5.2%' },
            { title: 'Active Devices', value: '987', change: '+3.1%' },
            { title: 'Total Alerts', value: '109', change: '-2.3%' },
            { title: 'Response Rate', value: '98.5%', change: '+0.5%' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <span className={`ml-2 text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts Trend */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Alerts Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={alertsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="alerts"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Device Usage Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Usage Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly User Activity</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="active" fill="#4ADE80" name="Active Users" />
                  <Bar dataKey="inactive" fill="#FB7185" name="Inactive Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h2>
            <div className="space-y-4">
              {[
                {
                  title: 'Monthly Activity Summary',
                  date: '2024-03-15',
                  type: 'PDF',
                  size: '2.4 MB'
                },
                {
                  title: 'Device Performance Analysis',
                  date: '2024-03-10',
                  type: 'Excel',
                  size: '1.8 MB'
                },
                {
                  title: 'User Engagement Report',
                  date: '2024-03-05',
                  type: 'PDF',
                  size: '3.1 MB'
                }
              ].map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(report.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{report.size}</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
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

export default ReportsPage; 
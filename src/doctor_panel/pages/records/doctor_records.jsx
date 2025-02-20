import React, { useState } from 'react';
import DoctorLayout from '../../components/layout/doctor_layout';
import { 
  MagnifyingGlassIcon,
  DocumentIcon,
  DocumentTextIcon,
  DocumentArrowUpIcon,
  FolderIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const DoctorRecords = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample records data
  const records = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      type: "Prescription",
      category: "medications",
      date: "Feb 15, 2024",
      size: "245 KB",
      status: "Signed",
      description: "Blood pressure medication prescription"
    },
    {
      id: 2,
      patientName: "Michael Brown",
      type: "Lab Report",
      category: "tests",
      date: "Feb 14, 2024",
      size: "1.2 MB",
      status: "Completed",
      description: "Blood sugar level test results"
    },
    {
      id: 3,
      patientName: "Emma Davis",
      type: "Medical Certificate",
      category: "certificates",
      date: "Feb 13, 2024",
      size: "180 KB",
      status: "Signed",
      description: "Fitness certificate for work"
    },
    {
      id: 4,
      patientName: "James Wilson",
      type: "Treatment Plan",
      category: "treatments",
      date: "Feb 12, 2024",
      size: "350 KB",
      status: "Draft",
      description: "Diabetes management plan"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Records', count: records.length },
    { id: 'medications', name: 'Prescriptions', count: records.filter(r => r.category === 'medications').length },
    { id: 'tests', name: 'Lab Reports', count: records.filter(r => r.category === 'tests').length },
    { id: 'certificates', name: 'Certificates', count: records.filter(r => r.category === 'certificates').length },
    { id: 'treatments', name: 'Treatment Plans', count: records.filter(r => r.category === 'treatments').length }
  ];

  const filteredRecords = records.filter(record => 
    (selectedCategory === 'all' || record.category === selectedCategory) &&
    (record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
     record.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Signed':
        return 'bg-green-50 text-green-700';
      case 'Completed':
        return 'bg-blue-50 text-blue-700';
      case 'Draft':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'Prescription':
        return <DocumentTextIcon className="h-6 w-6 text-blue-500" />;
      case 'Lab Report':
        return <DocumentIcon className="h-6 w-6 text-green-500" />;
      case 'Medical Certificate':
        return <DocumentArrowUpIcon className="h-6 w-6 text-purple-500" />;
      default:
        return <DocumentIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
              <p className="mt-1 text-gray-600">Manage and access patient medical records</p>
            </div>
            <button className="mt-4 md:mt-0 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all flex items-center space-x-2">
              <DocumentArrowUpIcon className="h-5 w-5" />
              <span>Upload New Record</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Categories Sidebar */}
          <div className="lg:w-64 bg-white rounded-xl shadow-sm border border-gray-100 h-fit">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Categories</h2>
            </div>
            <div className="p-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FolderIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <span className={`text-sm ${
                    selectedCategory === category.id ? 'bg-white/20' : 'bg-gray-100'
                  } px-2 py-0.5 rounded-full`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Records List */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="p-4 hover:bg-gray-50 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          {getDocumentIcon(record.type)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{record.patientName}</h3>
                          <p className="mt-1 text-sm text-gray-600">{record.description}</p>
                          <div className="mt-2 flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                            <span className="text-sm text-gray-500">{record.size}</span>
                            <div className="flex items-center text-sm text-gray-500">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {record.date}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorRecords; 
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import {
  DocumentTextIcon,
  PlusIcon,
  DocumentIcon,
  VideoCameraIcon,
  PhotoIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const ContentPage = () => {
  const [content] = useState([
    {
      id: 1,
      title: 'Fall Prevention Guide',
      type: 'PDF',
      category: 'Safety',
      author: 'Dr. Sarah Wilson',
      published: '2024-03-15',
      views: 245
    },
    {
      id: 2,
      title: 'Exercise Routines for Seniors',
      type: 'Video',
      category: 'Health',
      author: 'Physical Therapy Team',
      published: '2024-03-10',
      views: 532
    },
    {
      id: 3,
      title: 'Healthy Eating Guidelines',
      type: 'Article',
      category: 'Nutrition',
      author: 'Nutritionist Jane Doe',
      published: '2024-03-08',
      views: 189
    },
    {
      id: 4,
      title: 'Mental Wellness Tips',
      type: 'Article',
      category: 'Mental Health',
      author: 'Dr. Michael Brown',
      published: '2024-03-05',
      views: 423
    }
  ]);

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <DocumentIcon className="h-6 w-6 text-red-500" />;
      case 'video':
        return <VideoCameraIcon className="h-6 w-6 text-blue-500" />;
      case 'article':
        return <DocumentTextIcon className="h-6 w-6 text-green-500" />;
      default:
        return <LinkIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-gray-600 mr-3" />
            <h1 className="text-2xl font-semibold text-gray-800">Content Management</h1>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Content
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search content..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Categories</option>
              <option value="safety">Safety</option>
              <option value="health">Health</option>
              <option value="nutrition">Nutrition</option>
              <option value="mental-health">Mental Health</option>
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Types</option>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="article">Article</option>
            </select>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {getTypeIcon(item.type)}
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    {item.type}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    By {item.author}
                  </p>
                  <p className="text-sm text-gray-500">
                    Published on {new Date(item.published).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.views} views
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ContentPage; 
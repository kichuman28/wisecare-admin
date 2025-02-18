import React from 'react';
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
  const [content] = React.useState([
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
            <DocumentTextIcon className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-2xl font-semibold text-gray-800">Content Management</h1>
          </div>
          <button 
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Content
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search content..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover"
                />
              </div>
              <div className="ml-4">
                <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-hover">
                  <option value="">All Categories</option>
                  <option value="articles">Articles</option>
                  <option value="news">News</option>
                  <option value="updates">Updates</option>
                </select>
              </div>
            </div>

            {/* Content List */}
            <div className="space-y-4">
              {content.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg hover:border-primary-light transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-primary">{item.title}</h3>
                      <p className="text-gray-600 mt-1">{item.category}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <span className="bg-primary-light/20 text-primary px-2 py-1 rounded-full text-xs">
                          {item.type}
                        </span>
                        <span className="ml-4">Published: {new Date(item.published).toLocaleDateString()}</span>
                      </div>
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

export default ContentPage; 
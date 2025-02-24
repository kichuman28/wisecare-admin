import React from 'react';
import VideoUpload from '../components/VideoUpload';
import { VideoCameraIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import Layout from '../components/layout/Layout';

const VideoAnalysisPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <VideoCameraIcon className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Fall Detection Analysis</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Upload and Analyze Videos
              </h2>
              <p className="text-gray-600 mb-6">
                Upload video files to analyze for fall detection. Our AI-powered system will process the video and identify potential fall incidents.
              </p>
              <VideoUpload />
            </div>
          </div>

          {/* Instructions and Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <InformationCircleIcon className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-xl font-semibold text-gray-700">Instructions</h2>
              </div>
              
              <div className="space-y-4 text-gray-600">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-medium text-primary mb-2">Supported Formats</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>MP4 (recommended)</li>
                    <li>AVI</li>
                    <li>MOV</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Analysis Process</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Select a video file (max 50MB)</li>
                    <li>Click "Upload and Process Video"</li>
                    <li>Wait for the analysis to complete</li>
                    <li>Review the detailed results</li>
                  </ol>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-700 mb-2">Results Include</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-600">
                    <li>Total frames processed</li>
                    <li>Video FPS</li>
                    <li>Fall detection events with timestamps</li>
                    <li>Confidence scores</li>
                    <li>Fall probability scores</li>
                  </ul>
                </div>

                <div className="text-sm text-gray-500 mt-4">
                  <p className="flex items-center">
                    <InformationCircleIcon className="h-4 w-4 mr-1" />
                    For optimal results, ensure good lighting and clear visibility in the video.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoAnalysisPage; 
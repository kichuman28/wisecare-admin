import React from 'react';
import VideoUpload from '../components/VideoUpload';

const VideoAnalysisPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Video Fall Detection Analysis</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Upload and Analyze Videos
          </h2>
          <p className="text-gray-600 mb-6">
            Upload video files to analyze for fall detection. Supported formats: MP4, AVI, MOV.
          </p>
          <VideoUpload />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Instructions
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>Follow these steps to analyze videos for fall detection:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Select a video file (MP4, AVI, or MOV format)</li>
              <li>Click the "Upload and Process Video" button</li>
              <li>Wait for the analysis to complete</li>
              <li>Review the results, including:</li>
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>Total frames processed</li>
                <li>Video FPS</li>
                <li>Detected falls with timestamps</li>
                <li>Confidence scores and fall probabilities</li>
              </ul>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysisPage; 
import React, { useState } from 'react';
import { CloudArrowUpIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Detection = {
  frame_number: Number,
  time: Number,
  track_id: Number,
  status: String,
  confidence: Number,
  fall_score: Number,
  bounding_box: Array
};

const ProcessingResponse = {
  total_frames: Number,
  fps: Number,
  detections: Array
};

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!['video/mp4', 'video/avi', 'video/quicktime'].includes(selectedFile.type)) {
        setError('Please select a valid video file (MP4, AVI, or MOV)');
        setFile(null);
        return;
      }

      // Validate file size
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError(`File size too large. Please select a video under ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setUploadProgress(0);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);
    setResult(null);

    const formData = new FormData();
    formData.append('video', file);

    try {
      const apiUrl = import.meta.env.DEV 
        ? '/api/detect_fall'
        : `${import.meta.env.VITE_API_URL}/detect_fall`;

      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(Math.round(progress));
        }
      };

      const response = await new Promise((resolve, reject) => {
        xhr.open('POST', apiUrl);
        xhr.setRequestHeader('Accept', 'application/json');

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve({ ok: true, data });
            } catch (e) {
              reject(new Error('Invalid JSON response from server'));
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
          }
        };

        xhr.onerror = () => reject(new Error('Network error occurred'));
        xhr.onabort = () => reject(new Error('Upload aborted'));
        xhr.send(formData);
      });

      if (!response.ok) throw new Error('Upload failed');
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      setResult(response.data);
    } catch (err) {
      let errorMessage = 'An error occurred while processing the video';
      
      if (err.message.includes('Network error')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'The request timed out. The video might be too large or the server is busy.';
      } else if (err.message.includes('Invalid JSON')) {
        errorMessage = 'Received invalid response from server. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div className="relative">
        <input
          type="file"
          accept=".mp4,.avi,.mov"
          onChange={handleFileChange}
          className="hidden"
          id="video-upload"
        />
        <label
          htmlFor="video-upload"
          className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer
            ${file ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
            transition-colors duration-200`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <CloudArrowUpIcon className={`w-12 h-12 mb-3 ${file ? 'text-primary' : 'text-gray-400'}`} />
            {file ? (
              <div className="text-center">
                <p className="text-sm text-primary font-medium">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">MP4, AVI, or MOV (max 50MB)</p>
              </div>
            )}
          </div>
        </label>
      </div>

      {/* Upload Button and Progress */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className={`w-full py-3 px-4 rounded-lg font-medium transition duration-200
          ${loading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary-hover'
          }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Processing video...'}
          </div>
        ) : (
          'Upload and Process Video'
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-4 text-red-800 bg-red-50 rounded-lg">
          <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Frames</p>
              <p className="text-2xl font-semibold text-primary">{result.total_frames}</p>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="text-sm text-gray-500">FPS</p>
              <p className="text-2xl font-semibold text-primary">{result.fps}</p>
            </div>
          </div>

          {/* Detections List */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Fall Detections
                <span className="ml-2 text-sm text-gray-500">
                  ({result.detections.length} events)
                </span>
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {result.detections.map((detection, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <CheckCircleIcon className={`h-5 w-5 mr-2 ${
                        detection.confidence > 0.7 ? 'text-green-500' : 'text-yellow-500'
                      }`} />
                      <span className="font-medium text-gray-900">
                        Detection #{index + 1}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Frame {detection.frame_number}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Time: </span>
                      <span className="font-medium">{formatTime(detection.time)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Track ID: </span>
                      <span className="font-medium">{detection.track_id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status: </span>
                      <span className={`font-medium ${
                        detection.status === 'fall' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {detection.status.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Confidence: </span>
                      <span className="font-medium">
                        {(detection.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Fall Probability</span>
                      <span className="font-medium">
                        {(detection.fall_score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${detection.fall_score * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload; 
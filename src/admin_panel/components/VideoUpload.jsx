import React, { useState } from 'react';

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
      console.log('File selected:', {
        name: selectedFile.name,
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        type: selectedFile.type
      });

      // Validate file type
      if (!['video/mp4', 'video/avi', 'video/quicktime'].includes(selectedFile.type)) {
        setError('Please select a valid video file (MP4, AVI, or MOV)');
        return;
      }

      // Validate file size
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError(`File size too large. Please select a video under ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setUploadProgress(0);
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

    const formData = new FormData();
    formData.append('video', file);

    console.log('Starting video upload...', {
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      fileType: file.type
    });

    try {
      // Use relative URL when in development, full URL in production
      const apiUrl = import.meta.env.DEV 
        ? '/api/process-video'
        : `${import.meta.env.VITE_API_URL}/process-video`;
      
      console.log('Sending request to:', apiUrl);

      const xhr = new XMLHttpRequest();
      
      // Setup upload progress handling
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(Math.round(progress));
          console.log(`Upload progress: ${Math.round(progress)}%`);
        }
      };

      // Create a promise to handle the XHR request
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

        xhr.onerror = () => {
          reject(new Error('Network error occurred'));
        };

        xhr.onabort = () => {
          reject(new Error('Upload aborted'));
        };

        xhr.send(formData);
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      console.log('Received data:', response.data);
      
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      setResult(response.data);
      console.log('Video analysis completed successfully');
    } catch (err) {
      console.error('Upload/Processing error:', {
        message: err.message,
        stack: err.stack,
        type: err.name
      });
      
      let errorMessage;
      if (err.message.includes('Network error')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'The request timed out. The video might be too large or the server is busy.';
      } else if (err.message.includes('Invalid JSON')) {
        errorMessage = 'Received invalid response from server. Please try again.';
      } else {
        errorMessage = err.message || 'An error occurred while processing the video';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Fall Detection Video Analysis</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Video
        </label>
        <input
          type="file"
          accept=".mp4,.avi,.mov"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            border border-gray-300 rounded-md"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className={`w-full py-2 px-4 rounded-md ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white font-semibold transition duration-150`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Processing...'}
          </div>
        ) : (
          'Upload and Process Video'
        )}
      </button>

      {/* Upload Progress Bar */}
      {loading && uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1 text-center">
            Uploading: {uploadProgress}%
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Analysis Results</h3>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-white rounded-md shadow-sm">
                <p className="text-sm text-gray-500">Total Frames</p>
                <p className="text-lg font-semibold">{result.total_frames}</p>
              </div>
              <div className="p-3 bg-white rounded-md shadow-sm">
                <p className="text-sm text-gray-500">FPS</p>
                <p className="text-lg font-semibold">{result.fps}</p>
              </div>
            </div>
            
            <h4 className="font-semibold mb-3">Fall Detections:</h4>
            <div className="max-h-96 overflow-y-auto">
              {result.detections.map((detection, index) => (
                <div key={index} className="bg-white p-3 rounded-md shadow-sm mb-3">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm">
                      <span className="text-gray-500">Frame:</span> {detection.frame_number}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Time:</span> {detection.time.toFixed(2)}s
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Status:</span>{' '}
                      <span className={`font-semibold ${
                        detection.status === 'fall' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {detection.status.toUpperCase()}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Confidence:</span>{' '}
                      {(detection.confidence * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm col-span-2">
                      <span className="text-gray-500">Fall Score:</span>{' '}
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${detection.fall_score * 100}%` }}
                        ></div>
                      </div>
                    </p>
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
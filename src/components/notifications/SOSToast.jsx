import { Fragment, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { BellAlertIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const SOSToast = ({ show, onClose, alert }) => {
  const navigate = useNavigate();

  // Play alert sound when toast appears
  useEffect(() => {
    if (show) {
      const audio = new Audio('/alert.mp3'); // You'll need to add this sound file
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  }, [show]);

  const handleViewDetails = () => {
    navigate('/sos-alerts');
    onClose();
  };

  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed top-4 right-4 z-50 w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden ring-2 ring-red-500">
          {/* Red Alert Banner */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <BellAlertIcon className="h-6 w-6 text-white animate-pulse" />
              <span className="ml-2 text-lg font-bold text-white">EMERGENCY SOS ALERT</span>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-100 focus:outline-none"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Alert Content */}
          <div className="p-6 bg-gradient-to-b from-red-50 to-white">
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-600 mb-2">
                  Immediate Assistance Required
                </h3>
                <p className="text-gray-700 font-medium">
                  User {alert?.userId || 'Unknown'} has triggered an emergency alert
                </p>
                {alert?.location && (
                  <p className="text-sm text-gray-600 mt-2">
                    Location: {alert.location.latitude}, {alert.location.longitude}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleViewDetails}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-semibold 
                         hover:bg-red-700 transition-all duration-200
                         shadow-lg hover:shadow-red-500/50 focus:outline-none focus:ring-2 
                         focus:ring-red-500 focus:ring-offset-2"
              >
                View Emergency Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default SOSToast; 
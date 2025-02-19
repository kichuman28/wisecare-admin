import { Fragment, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { BellAlertIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const SOSToast = ({ show, onClose, alert, user }) => {
  const navigate = useNavigate();

  // Play alert sound when toast appears
  useEffect(() => {
    if (show) {
      const audio = new Audio('/alert.mp3');
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
      <div className="fixed inset-x-2 top-2 sm:top-4 sm:right-4 sm:left-auto z-50 w-auto sm:w-full sm:max-w-md">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden ring-2 ring-red-500">
          {/* Red Alert Banner */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
            <div className="flex items-center">
              <BellAlertIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white animate-pulse" />
              <span className="ml-2 text-base sm:text-lg font-bold text-white">EMERGENCY SOS ALERT</span>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-100 focus:outline-none p-1"
            >
              <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Alert Content */}
          <div className="p-4 sm:p-6 bg-gradient-to-b from-red-50 to-white">
            <div className="flex items-start sm:items-center mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-red-600 mb-3">
                  Immediate Assistance Required
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="h-10 w-10 rounded-full object-cover border-2 border-red-100 flex-shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base text-gray-900 font-medium truncate">
                      {user?.displayName || 'Unknown User'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {user?.email || `ID: ${alert?.userId || 'Unknown'}`}
                    </p>
                  </div>
                </div>
                {alert?.location && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-3 break-words">
                    Location: {alert.location.latitude}, {alert.location.longitude}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 sm:mt-6">
              <button
                onClick={handleViewDetails}
                className="w-full bg-red-600 text-white px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold 
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
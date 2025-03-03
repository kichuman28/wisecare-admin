import React from 'react';
import { XMarkIcon, UserIcon, PhoneIcon, ClockIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

const AssignStaffModal = ({ 
  isOpen, 
  onClose, 
  deliveryStaff, 
  selectedStaff, 
  setSelectedStaff, 
  onAssign, 
  assignLoading 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b border-gray-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">Assign Delivery Staff</h3>
          <button 
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
            onClick={onClose}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Select a delivery staff member who will be responsible for delivering this order.
          </p>
          
          <div className="max-h-60 overflow-y-auto pr-1">
            {deliveryStaff.length > 0 ? (
              <div className="space-y-3">
                {deliveryStaff.map((staff) => (
                  <div 
                    key={staff.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedStaff?.id === staff.id 
                        ? 'border-primary bg-primary-light/10 shadow-md' 
                        : 'border-gray-200 hover:border-primary-light hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedStaff(staff)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-primary-light/20 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="ml-3 flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{staff.name}</p>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <PhoneIcon className="h-3.5 w-3.5 mr-1" />
                              <span>{staff.phone}</span>
                            </div>
                          </div>
                          {selectedStaff?.id === staff.id && (
                            <span className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <ClockIcon className="h-3.5 w-3.5 mr-1.5" />
                        <span>{staff.preferred_shift || 'No shift preference'}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <BriefcaseIcon className="h-3.5 w-3.5 mr-1.5" />
                        <span>{staff.experience ? `${staff.experience} years exp.` : 'No experience data'}</span>
                      </div>
                      <div className="col-span-2 mt-1">
                        <p className="text-xs text-gray-500">{staff.shift_timing || 'No timing info'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg py-8 px-4 text-center">
                <UserIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No delivery staff available</p>
                <p className="text-xs text-gray-400 mt-1">Please add delivery staff members first</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="py-2 px-6 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onAssign}
              disabled={!selectedStaff || assignLoading}
            >
              {assignLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Assigning...
                </span>
              ) : 'Assign Staff'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignStaffModal; 
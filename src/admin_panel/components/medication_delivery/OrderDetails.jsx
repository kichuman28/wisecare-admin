import React from 'react';
import { 
  UserIcon, 
  ClipboardDocumentListIcon, 
  TruckIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  HomeIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import StatusBadge from './StatusBadge';

const OrderDetails = ({ 
  order, 
  patientDetails, 
  addressDetails,
  formatDate, 
  deliveryStatus, 
  setDeliveryStatus, 
  updateOrderStatus, 
  assignLoading, 
  setAssignModalOpen 
}) => {
  if (!order) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <TruckIcon className="h-12 w-12 text-gray-300 mx-auto" />
        <p className="mt-4 text-gray-500">Select an order to view details</p>
      </div>
    );
  }
  
  const patient = patientDetails[order.userId] || {};
  
  // More careful address handling
  const hasAddressId = Boolean(order.addressId);
  const addressDataExists = hasAddressId && addressDetails[order.addressId];
  const address = addressDataExists ? addressDetails[order.addressId] : null;
  
  console.log('OrderDetails - address data:', { 
    hasAddressId, 
    addressId: order.addressId, 
    addressDataExists, 
    address 
  });
  
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Order Details</h2>
        <StatusBadge status={order.status} />
      </div>
      <div className="p-6 space-y-6">
        {/* Order ID & Date */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="text-sm font-medium text-gray-800">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Order Date</p>
            <p className="text-sm text-gray-800">{formatDate(order.orderDate)}</p>
          </div>
        </div>
        
        {/* Patient Information */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <UserIcon className="h-4 w-4 mr-1.5 text-primary" />
            Patient Information
          </h3>
          
          <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
            <div className="flex items-start space-x-3">
              {patient.photoURL ? (
                <img 
                  src={patient.photoURL} 
                  alt={patient.name} 
                  className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary-light/30 flex items-center justify-center text-primary font-medium">
                  {patient.name?.charAt(0) || '?'}
                </div>
              )}
              
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-800">{patient.name}</h4>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="flex items-center text-gray-700">
                    <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {patient.phone || 'No phone number'}
                  </p>
                  <p className="flex items-center text-gray-700">
                    <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {patient.email || 'No email'}
                  </p>
                </div>
              </div>
            </div>
            
            {(patient.createdAt || patient.lastLoginAt) && (
              <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2 text-xs text-gray-500">
                {patient.createdAt && (
                  <div className="flex items-center">
                    <CalendarIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    <span>Joined: {formatDate(patient.createdAt)}</span>
                  </div>
                )}
                {patient.lastLoginAt && (
                  <div className="flex items-center">
                    <ClockIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    <span>Last active: {formatDate(patient.lastLoginAt)}</span>
                  </div>
                )}
              </div>
            )}
            
            {patient.provider && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                  {patient.provider}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1.5 text-primary" />
            Delivery Address
          </h3>
          
          <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
            {!hasAddressId ? (
              <div className="flex items-center text-amber-600">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                <p>No address ID provided for this order</p>
              </div>
            ) : !addressDataExists ? (
              <div className="flex items-center text-amber-600">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                <p>Address data not loaded yet</p>
              </div>
            ) : address && address.address ? (
              <div className="space-y-3">
                <div className="flex items-start">
                  <HomeIcon className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {address.address}
                    </p>
                  </div>
                </div>
                
                {address.additionalInfo && (
                  <div className="flex items-start">
                    <InformationCircleIcon className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <p className="text-sm text-gray-600">{address.additionalInfo}</p>
                  </div>
                )}
                
                {(address.latitude && address.longitude) && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Location: {address.latitude.toFixed(6)}, {address.longitude.toFixed(6)}
                    </p>
                    <a 
                      href={`https://www.google.com/maps?q=${address.latitude},${address.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:text-primary-hover mt-1 inline-block"
                    >
                      View on Google Maps
                    </a>
                  </div>
                )}
                
                {address.isDefault && (
                  <div className="pt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700">
                      Default Address
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center text-amber-600">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <p>Address data is empty or invalid</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Prescription & Medicine Details */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <ClipboardDocumentListIcon className="h-4 w-4 mr-1.5 text-primary" />
            Medicine Details
          </h3>
          <ul className="space-y-3">
            {order.medicines.map((medicine, index) => (
              <li key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-800">{medicine.medicineName}</p>
                  <p className="text-sm font-semibold text-primary">₹{medicine.totalPrice}</p>
                </div>
                <div className="mt-2 text-xs text-gray-500 grid grid-cols-2 gap-2">
                  <p className="flex items-center">
                    <span className="w-20 text-gray-600">Quantity:</span> 
                    <span className="font-medium">{medicine.quantity} units</span>
                  </p>
                  <p className="flex items-center">
                    <span className="w-20 text-gray-600">Price/Unit:</span> 
                    <span className="font-medium">₹{medicine.pricePerUnit}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="w-20 text-gray-600">Dosage:</span> 
                    <span className="font-medium">{medicine.dosage}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="w-20 text-gray-600">Frequency:</span> 
                    <span className="font-medium">{medicine.frequency}</span>
                  </p>
                  <p className="col-span-2 flex items-center">
                    <span className="w-20 text-gray-600">Days Supply:</span> 
                    <span className="font-medium">{medicine.daysSupply} days</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between items-center border-t border-gray-100 pt-3 px-2">
            <p className="text-sm font-medium text-gray-700">Total Amount</p>
            <p className="text-base font-bold text-primary">₹{order.totalAmount}</p>
          </div>
        </div>
        
        {/* Assignment & Actions */}
        <div className="border-t border-gray-100 pt-4 space-y-4">
          <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
            <TruckIcon className="h-4 w-4 mr-1.5 text-primary" />
            Delivery Status
          </h3>
          
          {order.deliveryStaffId ? (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
              <p className="text-sm font-medium text-gray-800">Assigned To</p>
              <p className="text-sm text-gray-700 mb-3">{order.deliveryStaffName}</p>
              
              {/* Status update for assigned orders */}
              <div className="mt-3 grid grid-cols-1 gap-2">
                <p className="text-sm font-medium text-gray-800">Update Status</p>
                <select 
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-sm"
                  value={deliveryStatus}
                  onChange={(e) => setDeliveryStatus(e.target.value)}
                >
                  <option value="">Select status...</option>
                  <option value="processing">Processing</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  className="w-full py-2 px-4 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover transition-colors"
                  onClick={updateOrderStatus}
                  disabled={!deliveryStatus || assignLoading}
                >
                  {assignLoading ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-tr from-amber-50 to-amber-100 rounded-lg p-4 shadow-sm text-center border border-amber-200">
              <p className="text-sm text-amber-800 mb-3">This order needs to be assigned to a delivery staff member</p>
              <button
                className="flex items-center justify-center mx-auto py-2.5 px-6 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition-colors shadow-sm"
                onClick={() => setAssignModalOpen(true)}
              >
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Assign Delivery Staff
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 